(function() {
  var jsonn;

  jsonn = angular.module('Jsonn', []);

  jsonn.factory('Json', function() {
    var id, json;
    id = function() {
      var chars, i, result, str, _i;
      str = 'abcdefghijklmnopqrstuvwxyz' + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + '0123456789';
      chars = str.split('');
      result = '';
      for (i = _i = 0; _i < 10; i = ++_i) {
        result += chars[Math.floor(Math.random() * chars.length)];
      }
      return result;
    };
    json = [
      {
        layer: 1,
        key: "因幡",
        val: "てゐ",
        parent: false,
        id: '0000000000'
      }, {
        layer: 1,
        key: "霧雨",
        val: "魔理沙",
        parent: false,
        id: '0000000000'
      }, {
        layer: 1,
        key: "アリス",
        val: "マーガトロイド",
        parent: false,
        id: '0000000000'
      }, {
        layer: 1,
        key: "博霊",
        val: "霊夢",
        parent: false,
        id: '0000000000'
      }, {
        layer: 1,
        key: "チルノ",
        val: "⑨",
        parent: false,
        id: '0000000000'
      }, {
        layer: 1,
        key: "プリキュア",
        val: "",
        parent: true,
        id: '0000000001'
      }, {
        layer: 2,
        key: "キュアラブリー",
        val: "愛乃めぐみ",
        parent: false,
        id: '0000000001'
      }, {
        layer: 2,
        key: "キュアプリンセス",
        val: "白雪姫",
        parent: false,
        id: '0000000001'
      }
    ];
    return {
      getJson: function() {
        return json;
      },
      checkJsonVal: function(key, id) {
        var j, _i, _len;
        for (_i = 0, _len = json.length; _i < _len; _i++) {
          j = json[_i];
          if (j.id === id) {
            if (j.key === key) {
              return 1;
            }
          }
        }
        return 0;
      },
      getLen: function() {
        return json.length;
      },
      addJson: function(hashValue, nowId) {
        var num;
        num = this.checkJsonVal(hashValue.key);
        if (num === 0) {
          hashValue.id = nowId != null ? nowId : id();
          json.push(hashValue);
        }
        return hashValue;
      },
      insert: function(idx, hashValue) {
        var isEmptyId, len, t, tmp, _i, _len, _results;
        isEmptyId = hashValue.id === '';
        if (isEmptyId) {
          hashValue.id = id();
        }
        console.log(hashValue);
        len = this.getLen();
        tmp = [];
        if (idx + 1 === len) {
          return json.push(hashValue);
        } else {
          tmp = json.slice(idx + 1, +len + 1 || 9e9);
          json.length = idx + 1;
          json.push(hashValue);
          _results = [];
          for (_i = 0, _len = tmp.length; _i < _len; _i++) {
            t = tmp[_i];
            _results.push(json.push(t));
          }
          return _results;
        }
      },
      "delete": function(idx) {
        var af, len, t, _i, _len, _results;
        len = this.getLen();
        if (idx === 0) {
          return json.shift();
        } else if (idx + 1 === len) {
          return json.pop();
        } else {
          af = json.slice(idx + 1, +len + 1 || 9e9);
          json.length = idx;
          _results = [];
          for (_i = 0, _len = af.length; _i < _len; _i++) {
            t = af[_i];
            _results.push(json.push(t));
          }
          return _results;
        }
      },
      update: function(idx, target, val) {
        var key, layer, parent, renew, _ref;
        if (target === 'key') {
          if (val === '') {
            if (idx + 1 === json.length) {
              this["delete"](idx);
              return 3;
            } else {
              this["delete"](idx);
              return 1;
            }
          } else {
            _ref = [json[idx].layer, val, json[idx].val, json[idx].parent], layer = _ref[0], key = _ref[1], val = _ref[2], parent = _ref[3];
            renew = {
              layer: layer,
              key: key,
              val: val,
              parent: parent
            };
            return json[idx] = renew;
          }
        } else if (target === 'val') {
          if (val === '') {
            return 2;
          } else {
            val = val === '{' ? '' : val;
            return json[idx].val = val;
          }
        }
      }
    };
  });

  jsonn.factory('Cache', function() {
    var editForm, flagLi, ids, ori, pane, prevNode;
    flagLi = false;
    editForm = false;
    ori = null;
    pane = null;
    ids = ['0000000000'];
    prevNode = null;
    return {
      setPane: function(title) {
        return pane = title;
      },
      getPane: function() {
        return pane;
      },
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
      },
      setIds: function(id) {
        return ids.push(id);
      },
      getIds: function() {
        return ids;
      },
      getIdsSize: function() {
        return ids.length;
      },
      setNode: function(node) {
        return prevNode = node;
      },
      getNode: function() {
        return prevNode;
      }
    };
  });

  jsonn.service('Tpl', function() {
    this.tabTpl = "<div class=\"in_content\">\n  <div class=\"tab_\">\n    <ul class=\"tab-ul\">\n      <li ng-repeat=\"pane in panes\" class=\"tab-li\" ng-class=\"{'tab-act':pane.selected}\">\n        <a href ng-click=\"select(pane)\" class=\"tab-btn\">{{pane.title}}</a>\n      </li>\n    </ul>\n  </div>\n  <div ng-transclude class=\"main main-{{selected.title}}\"></div>\n</div>";
    this.jsonTpl = "<ol class=\"json-ol {{pane.title}}\">\n  <li json-row _addFormTpl=\"\" ng-click=\"add()\" ng-repeat=\"json in jsons\" class=\"json-li\" data-index=\"{{$index}}\" data-type=\"json\" data-layer=\"{{json.layer}}\" data-parent=\"{{json.parent}}\" data-id=\"{{json.id}}\">\n    <span class=\"json-key json-edit json-layer{{json.layer}}\" ng-blur=\"update($index, $event, 'key')\" ng-keydown=\"key()\" contenteditable>{{json.key}}</span>\n    <span class=\"json-edit\" ng-class=\"{'json-parent':json.val == ''}\" ng-blur=\"update($index, $event, 'val')\" contenteditable>{{json.val == '' ? '{' : json.val}}</span>\n  </li>\n  <li json-add-form id=\"main-form\" class=\"json-li json-li-form\" data-id=\"{{id()}}\" data-layer=\"{{layer()}}\">\n    <input ng-model=\"new.key\" type=\"text\" class=\"json-new json-new-key json-layer{{layer()}}\" ng-keydown=\"keyKeycode($event)\" autofocus>\n    <input ng-model=\"new.val\" type=\"text\" class=\"json-new json-new-val\" ng-focus=\"isFocus=true\" ng-blur=\"isFocus=false\" ng-keydown=\"valKeycode($event)\">\n  </li>\n</ul>";
    this.resultTpl = "<ol class=\"result-ol\">\n  <li class=\"result-li\"><div class=\"result-json\">{{json()}}</div></li>\n</ul>";
    this.addFormTpl = function(idx, layer, parent, id) {
      return "<li json-add-form id=\"insert-form\" class=\"json-li json-li-form\" data-original=\"" + idx + "\" data-layer=\"" + (parent === true ? layer + 1 : layer) + "\" data-parent=\"" + parent + "\" data-id=\"" + id + "\">\n  <input ng-model=\"new.key\" type=\"text\" class=\"json-new json-layer" + (parent === true ? layer + 1 : layer) + "\" ng-keydown=\"keyKeycode($event)\" autofocus>\n  <input ng-model=\"new.val\" type=\"text\" class=\"json-new json-new-val\" ng-focus=\"isFocus=true\" ng-blur=\"isFocus=false\" ng-keydown=\"valKeycode($event)\">\n</li>";
    };
    return this;
  });

  jsonn.directive('tabs', [
    '$document', '$timeout', 'Tpl', 'Cache', function($document, $timeout, Tpl, Cache) {
      return {
        restrict: 'E',
        transclude: true,
        controller: function($scope, $element) {
          var panes;
          panes = $scope.panes = [];
          $scope.selected = null;
          $scope.select = function(pane) {
            angular.forEach(panes, function(pane) {
              return pane.selected = false;
            });
            pane.selected = true;
            return $scope.selected = pane;
          };
          this.addPane = function(pane) {
            if (panes.length === 0) {
              $scope.select(pane);
            }
            return panes.push(pane);
          };
          $document.on('keydown', function(e) {
            switch (e.keyCode) {
              case 39:
                angular.forEach(panes, function(pane) {
                  return pane.selected = false;
                });
                $scope.selected = panes[1];
                panes[1].selected = true;
                return $scope.$apply();
              case 37:
                angular.forEach(panes, function(pane) {
                  return pane.selected = false;
                });
                $scope.selected = panes[0];
                panes[0].selected = true;
                return $scope.$apply();
            }
          });
          return this;
        },
        link: function(scope, element, attrs) {
          return scope.title = Cache.getPane();
        },
        template: Tpl.tabTpl,
        replace: true
      };
    }
  ]);

  jsonn.directive('jsonPane', [
    '$document', '$compile', 'Json', 'Tpl', 'Cache', function($document, $compile, Json, Tpl, Cache) {
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
          scope.pane = null;
          scope.select = function() {
            return scope.pane = tabsCtrl.getPane();
          };
          scope.jsons = Json.getJson();
          scope.layer = function() {
            var ids;
            ids = Cache.getIds();
            return ids.length;
          };
          return scope.id = function() {
            var ids;
            ids = Cache.getIds();
            return ids[ids.length - 1];
          };
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
            var el, insertForm, tgt, type;
            tgt = e.target;
            switch (tgt.tagName) {
              case 'LI':
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
              default:
                insertForm = $document[0].querySelector('#insert-form');
                if (insertForm != null) {
                  return $(insertForm).remove();
                }
            }
          });
          return scope.add = function() {
            return $timeout(function() {
              var id, idx, layer, parent;
              if (Cache.getFlagLi()) {
                layer = element.data('layer');
                parent = element.data('parent');
                id = element.data('id');
                idx = Cache.getOri();
                attrs.$set('_addFormTpl', Tpl.addFormTpl(idx, layer, parent, id));
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
            layer: null,
            key: '',
            val: '',
            parent: false,
            id: ''
          };
          scope.edit = false;
          scope.update = function(idx, e, target) {
            var num, val;
            val = e.target.innerText;
            num = Json.update(idx, target, val);
            if (num === 1) {
              return e.target.parentNode.nextSibling.nextSibling.querySelector('.json-key').focus();
            } else if (num === 2) {
              return e.target.innerText = "\"\"";
            } else if (num === 3) {
              return e.target.parentNode.nextSibling.nextSibling.nextSibling.querySelector('.json-new-key').focus();
            }
          };
          scope.key = function(e) {};
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
            var id, idsSize, idx, isFocus, layer, num, presentKey, presentVal, result;
            isFocus = scope.isFocus === true;
            switch (e.keyCode) {
              case 9:
              case 13:
                e.preventDefault();
                presentKey = scope["new"].key !== '';
                presentVal = scope["new"].val !== '';
                scope["new"].layer = element.data('layer');
                id = element.data('id');
                layer = element.data('layer');
                if (isFocus && presentKey) {
                  if (scope.isId === scope.$id) {
                    if (Json.checkJsonVal(scope["new"].key, id) === 0) {
                      if (presentVal) {
                        if (element.context.previousElementSibling.dataset.parent === 'true') {
                          scope["new"].layer = parseInt(element.context.dataset.layer);
                        } else {
                          scope["new"].layer = element.context.dataset.layer;
                        }
                        Json.addJson(scope["new"], element.context.dataset.id);
                        scope["new"] = {
                          layer: null,
                          key: '',
                          val: '',
                          parent: false,
                          id: ''
                        };
                        return $timeout(function() {
                          element[0].children[0].focus();
                          return Cache.setNode(null);
                        }, 1);
                      } else {
                        idsSize = Cache.getIdsSize();
                        if (element.context.previousElementSibling.dataset.parent === 'true') {
                          scope["new"].layer = parseInt(element.context.dataset.layer);
                          element.context.dataset.layer = parseInt(element.context.dataset.layer) + 1;
                        } else {
                          scope["new"].layer = element.context.dataset.layer;
                        }
                        scope["new"].parent = true;
                        result = Json.addJson(scope["new"]);
                        Cache.setIds(result.id);
                        scope["new"] = {
                          layer: null,
                          key: '',
                          val: '',
                          parent: false,
                          id: ''
                        };
                        return $timeout(function() {
                          element[0].children[0].focus();
                          return Cache.setNode(null);
                        }, 1, 1);
                      }
                    }
                  } else {
                    idx = Cache.getOri();
                    if (Json.checkJsonVal(scope["new"].key, id) === 0) {
                      if (!presentVal) {
                        scope["new"].parent = true;
                      } else {
                        scope["new"].id = id;
                      }
                      Json.insert(idx, scope["new"]);
                      scope["new"] = {
                        layer: null,
                        key: '',
                        val: '',
                        parent: false,
                        id: ''
                      };
                      return $timeout(function() {
                        return element[0].remove();
                      }, 1);
                    }
                  }
                }
                break;
              case 219:
                if (e.altKey === true) {
                  id = function() {
                    var node, now, prev;
                    node = Cache.getNode() != null ? Cache.getNode() : e.target.parentNode;
                    now = node.dataset.id;
                    prev = node.dataset.id;
                    if (node.dataset.layer === '1') {
                      return '0000000000';
                    }
                    while (prev === now) {
                      node = node.previousElementSibling;
                      prev = node.dataset.id;
                    }
                    Cache.setNode(node);
                    return prev;
                  };
                  layer = function() {
                    var elClassList;
                    elClassList = e.target.previousElementSibling.classList;
                    layer = elClassList.toString().match(/json-layer(\d)/)[1];
                    if (layer === '1') {
                      return false;
                    }
                    elClassList.remove("json-layer" + layer);
                    elClassList.add("json-layer" + (parseInt(layer) - 1));
                    return layer;
                  };
                  if (layer()) {
                    id = id();
                    num = layer;
                    console.log(id);
                    e.target.parentNode.dataset.id = id;
                    return e.target.parentNode.dataset.layer = parseInt(num) - 1;
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
          tabsCtrl.addPane(scope);
          return scope.json = function() {
            var count, currentId, ids, json, layer, layerCount, len, result;
            json = Json.getJson();
            len = json.length;
            result = '{';
            ids = ['0000000000'];
            currentId = '0000000000';
            count = 0;
            layer = 0;
            layerCount = 0;
            angular.forEach(json, function(json) {
              var differentId, i, sameId, _i, _ref, _results;
              count++;
              differentId = json.id !== currentId;
              sameId = json.id === currentId;
              if (sameId) {
                layerCount++;
                if (layerCount !== 1) {
                  result += ',';
                }
                result += "\"" + json.key + "\":\"" + json.val + "\"";
                if (len === count) {
                  _results = [];
                  for (i = _i = 1, _ref = ids.length; 1 <= _ref ? _i < _ref : _i > _ref; i = 1 <= _ref ? ++_i : --_i) {
                    _results.push(result += '}');
                  }
                  return _results;
                }
              } else if (differentId) {
                layerCount = 0;
                if (json.id === ids[layer - 1]) {
                  result += '},';
                  result += "\"" + json.key + "\":\"" + json.val + "\"";
                  layer--;
                  ids.pop();
                } else {
                  if (layerCount === 0) {
                    result += ',';
                  }
                  result += "\"" + json.key + "\":{";
                  layer++;
                  ids.push(json.id);
                }
                return currentId = json.id;
              }
            });
            result += '}';
            return result;
          };
        },
        template: Tpl.resultTpl,
        replace: true
      };
    }
  ]);

}).call(this);

/*
//# sourceMappingURL=../../dist/js/jsonn.js.map
*/