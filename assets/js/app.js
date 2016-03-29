/* global angular, $ */
'use strict';

var ipc = require('electron').ipcRenderer;

var MyApp = angular.module( 'MyApp', [ 
    'btford.markdown',
    'ui.codemirror',
    ] )
    .config(['markdownConverterProvider', function (markdownConverterProvider) {
      // options to be passed to Showdown
      // see: https://github.com/coreyti/showdown#extensions
      markdownConverterProvider.config({
        extensions: ['github', 'table']
      });
    }]);

var API_METHODS = ['GET', 'POST', 'PUT', 'DELETE' ];


function Api(data){
  data = data || {};
  return {
    method: data.method || 'GET',
      action: data.action || '',
      description: data.description || '',
      query: data.query ||[],
      resBody: data.resBody ||[],
      body: data.body || [],
      exampleReq: data.exampleReq || '',
      exampleRes: data.exampleRes || ''
  };
}

MyApp.controller( 'MainCtrl', ['$scope', function( $scope ){

  $scope.API_METHODS = API_METHODS;
  $scope.apiData = [];
  $scope.currentItem = {};

  $scope.editorOptions = {
    lineWrapping : true,
  lineNumbers: true,
  // readOnly: 'nocursor',
  theme: 'monokai',
  mode: 'javascript',
  };
  $scope.codePreviewOpts = {
    lineWrapping : true,
  lineNumbers: false,
  readOnly: 'nocursor',
  theme: 'monokai',
  viewportMargin: Infinity,
  mode: 'javascript',
  };

  $scope.setCurrentItem = function( item ){
    $scope.currentItem.selected = false;
    $scope.currentItem = item;
    item.selected = true;
  };

  ipc.send( 'readFile' );

  ipc.on( 'dataFile', function( event, data ){
    $scope.apiData.splice(0);
    data.forEach( function(v){
      $scope.apiData.push( Api(v) );
    });
    applyBindings();
    $scope.$apply();
  });

  $scope.save = function(){
    console.log('Saving data...');
    ipc.send('writeFile', angular.copy( $scope.apiData ).map( function(v){ delete v.selected; return v; }) );
  };

  $scope.addApi = function(){
    $scope.apiData.push( Api() );
    applyBindings();
  };

  $scope.addParam = function(){
    $scope.currentItem.query.push({
      name: '',
      type: 'String',
      description: '',
    });
  };
  $scope.addBody = function(){
    $scope.currentItem.body.push({
      name: '',
      type: 'String',
      description: '',
    });
  };
  $scope.addResBody = function(){
    $scope.currentItem.resBody.push({
      name: '',
      type: 'String',
      description: '',
    });
  };
  $scope.removeParam = function(param){
    var index = $scope.currentItem.query.indexOf(param);
    $scope.currentItem.query.splice(index, 1);
  };
  $scope.removeBody = function(param){
    var index = $scope.currentItem.body.indexOf(param);
    $scope.currentItem.body.splice(index, 1);
  };
  $scope.removeResBody = function(param){
    var index = $scope.currentItem.resBody.indexOf(param);
    $scope.currentItem.resBody.splice(index, 1);
  };

  $scope.reOrderArr = function( ar, item, distance ){
    var currentPos = ar.indexOf( item );
    if( currentPos < 0 ){
      return;
    }
    if( ( currentPos + distance ) >= ar.length ){
      return;
    }
    if( ( currentPos + distance ) < 0 ){
      return;
    }
    ar.splice( currentPos, 1 );
    ar.splice( currentPos + distance, 0, item );
    return;
  };

  $scope.removeItem = function( arr, item ){
    var index = arr.indexOf( item );
    if( index < 0 ){
      return;
    }
    arr.splice( index, 1 );
  };


  if(  $scope.apiData[0] ){
    $scope.setCurrentItem(  $scope.apiData[0] );
  } else {
    $scope.addApi();
  }
}] );


function applyBindings(){
  setTimeout( function(){
    $('.panel .self-collapse')
      .unbind('click')
      .click(function(){
        $(this).parent().next().collapse('toggle');
      });
  }, 1000 );
}
