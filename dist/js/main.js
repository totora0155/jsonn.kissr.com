(function() {
  var jsonn;

  jsonn = angular.module('Jsonn', []);

  jsonn.factory('Json', function() {
    var json;
    json = [
      {
        key: "aksdjf",
        val: "fjdsalkjf"
      }, {
        key: "sdlfksdjf",
        val: "fjdsalkjf"
      }, {
        key: "aksdsdjlfk",
        val: "fjdsalkjf"
      }, {
        key: "aksdxljsljf",
        val: "fjdsalkjf"
      }, {
        key: "aksdjasdjff",
        val: "fjdsalkjf"
      }
    ];
    return {
      getJson: function() {
        return json;
      },
      getLen: function() {
        return json.length;
      },
      addJson: function(hashValue) {
        return json.push(hashValue);
      },
      insert: function(idx, hashValue) {
        var len, t, tmp, _i, _len;
        len = this.getLen();
        tmp = [];
        console.log(idx);
        console.log(len);
        if (idx === len) {
          json.push(hashValue);
          return console.log('ue');
        } else {
          tmp = json.slice(idx + 1, +len + 1 || 9e9);
          json.length = idx + 1;
          json.push(hashValue);
          for (_i = 0, _len = tmp.length; _i < _len; _i++) {
            t = tmp[_i];
            json.push(t);
          }
          return console.log(angular.toJson(json));
        }
      }
    };
  });

  jsonn.factory('Cache', function() {
    var editForm, flagLi, ori;
    flagLi = false;
    editForm = false;
    ori = null;
    return {
      setFlagLi: function(bool) {
        return flagLi = bool;
      },
      getFlagLi: function() {
        return flagLi;
      },
      setOri: function(num) {
        return ori = num;
      },
      getOri: function() {
        return ori;
      },
      setEditForm: function(text) {
        return editForm = text;
      },
      getEditForm: function() {
        return editForm;
      }
    };
  });

  jsonn.service('Tpl', function() {
    this.tabTpl = "<div class=\"in_content\">\n  <div class=\"tab_\">\n    <ul class=\"tab-ul\">\n      <li ng-repeat=\"pane in panes\" class=\"tab-li\" ng-class=\"{'tab-act':pane.selected}\">\n        <a href ng-click=\"select(pane)\" class=\"tab-btn\">{{pane.title}}</a>\n      </li>\n    </ul>\n  </div>\n  <div ng-transclude class=\"main_\"></div>\n</div>";
    this.jsonTpl = "<div class=\"main-pane\">\n  <ol class=\"main-ol\">\n    <li json-row _addFormTpl=\"\" ng-click=\"add()\" ng-repeat=\"json in jsons\" data-index=\"{{$index}}\" class=\"main-li\" data-type=\"json\">\n      <span ng-click=\"edit($index, 'key')\" class=\"main-key\">{{json.key}}</span>\n      <span ng-click=\"edit($index, 'val')\" class=\"main-val\">{{json.val}}</span>\n    </li>\n    <li json-add-form id=\"main-form\" class=\"main-li main-li-form\">\n      <input ng-model=\"new.key\" type=\"text\" class=\"main-intx\" ng-keydown=\"keyKeycode($event)\" autofocus>\n      <input ng-model=\"new.val\" type=\"text\" class=\"main-intx main-intx-val\" ng-focus=\"isFocus=true\" ng-blur=\"isFocus=false\" ng-keydown=\"valKeycode($event)\">\n    </li>\n  </ul>\n</div>";
    this.addFormTpl = function(idx) {
      return "<li json-add-form id=\"insert-form\" class=\"main-li main-li-form\" data-original=\"" + idx + "\">\n  <input ng-model=\"new.key\" type=\"text\" class=\"main-intx\" ng-keydown=\"keyKeycode($event)\" autofocus>\n  <input ng-model=\"new.val\" type=\"text\" class=\"main-intx main-intx-val\" ng-focus=\"isFocus=true\" ng-blur=\"isFocus=false\" ng-keydown=\"valKeycode($event)\">\n</li>";
    };
    return this;
  });

  jsonn.directive('tabs', [
    'Tpl', function(Tpl) {
      return {
        restrict: 'E',
        transclude: true,
        controller: function($scope, $element) {
          var panes;
          panes = $scope.panes = [];
          $scope.select = function(pane) {
            angular.forEach(panes, function(pane) {
              return pane.selected = false;
            });
            return pane.selected = true;
          };
          this.addPane = function(pane) {
            if (panes.length === 0) {
              $scope.select(pane);
            }
            return panes.push(pane);
          };
          return this;
        },
        template: Tpl.tabTpl,
        replace: true
      };
    }
  ]);

  jsonn.directive('jsonPane', [
    '$document', '$compile', 'Json', 'Tpl', function($document, $compile, Json, Tpl) {
      return {
        require: '^tabs',
        restrict: 'E',
        transclude: true,
        scope: {
          title: '@'
        },
        controller: function($scope, $element) {
          this.add = function(hash) {
            return Json.addJson(hash.key, hash.val);
          };
          return this;
        },
        link: function(scope, element, attrs, tabsCtrl) {
          tabsCtrl.addPane(scope);
          return scope.jsons = Json.getJson();
        },
        template: Tpl.jsonTpl,
        replace: true
      };
    }
  ]);

  jsonn.directive('jsonRow', [
    '$compile', '$document', '$timeout', 'Tpl', 'Cache', function($compile, $document, $timeout, Tpl, Cache) {
      return {
        link: function(scope, element, attrs) {
          attrs.$observe('_addFormTpl', function(tpl) {
            var el;
            if (angular.isDefined(tpl) && tpl !== null) {
              el = $compile(tpl)(scope);
              element.after(el);
              return attrs.$set('_addFormTpl', null);
            }
          });
          $document.on('click', function(e) {
            var editForm, el, insertForm, tgt, type;
            tgt = e.target;
            switch (tgt.tagName) {
              case 'LI':
                editForm = $document[0].querySelector('#edit-form');
                if (editForm != null) {
                  $(editForm).remove();
                }
                console.log('hoge');
                Cache.setFlagLi(true);
                el = angular.element(tgt);
                type = el.data('type');
                Cache.setOri(el.data('index'));
                if (type === 'json') {
                  insertForm = $document[0].querySelector('#insert-form');
                  if (insertForm != null) {
                    return $(insertForm).remove();
                  }
                }
                break;
              case 'SPAN':
                break;
              default:
                insertForm = $document[0].querySelector('#insert-form');
                editForm = $document[0].querySelector('#edit-form');
                if (insertForm != null) {
                  $(insertForm).remove();
                }
                if (editForm != null) {
                  return $(editForm).remove();
                }
            }
          });
          return scope.add = function() {
            return $timeout(function() {
              var idx;
              if (Cache.getFlagLi()) {
                idx = Cache.getOri();
                attrs.$set('_addFormTpl', Tpl.addFormTpl(idx));
              }
              return Cache.setFlagLi(false);
            }, 1);
          };
        }
      };
    }
  ]);

  jsonn.directive('jsonAddForm', [
    '$timeout', 'Json', 'Cache', function($timeout, Json, Cache) {
      return {
        link: function(scope, element, attrs) {
          scope["new"] = {
            key: '',
            val: ''
          };
          scope.isId = scope.isId != null ? scope.isId : scope.$id;
          scope.isFocus = false;
          scope.getFocus = false;
          scope.keyKeycode = function(e) {
            switch (e.keyCode) {
              case 221:
                if (e.ctrlKey === true) {
                  return console.log('ok');
                }
            }
          };
          return scope.valKeycode = function(e) {
            var idx, isFocus, presentKey, presentVal;
            switch (e.keyCode) {
              case 9:
              case 13:
                e.preventDefault();
                isFocus = scope.isFocus === true;
                presentKey = scope["new"].key !== '';
                presentVal = scope["new"].val !== '';
                if (isFocus && presentKey && presentVal) {
                  if (scope.isId === scope.$id) {
                    Json.addJson(scope["new"]);
                    scope["new"] = {
                      key: '',
                      val: ''
                    };
                    return $timeout(function() {
                      return element[0].children[0].focus();
                    }, 1);
                  } else {
                    idx = Cache.getOri();
                    Json.insert(idx, scope["new"]);
                    return $timeout(function() {
                      return element[0].remove();
                    }, 1);
                  }
                }
            }
          };
        }
      };
    }
  ]);

  jsonn.directive('resultPane', [
    '$document', '$compile', 'Json', 'Tpl', function($document, $compile, Json, Tpl) {
      return {
        require: '^tabs',
        restrict: 'E',
        transclude: true,
        scope: {
          title: '@'
        },
        link: function(scope, element, attrs, tabsCtrl) {
          return tabsCtrl.addPane(scope);
        },
        replace: true
      };
    }
  ]);

}).call(this);

/*
//# sourceMappingURL=../../dist/js/main.js.map
*/