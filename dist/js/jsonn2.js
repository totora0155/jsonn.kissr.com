(function() {
  var jsonn;

  jsonn = angular.module('Jsonn', []);

  jsonn.factory('Json', function() {
    var first, id, ids, json;
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
    ids = {
      '0000000000': {
        next: null
      }
    };
    first = true;
    json = [
      {
        layer: 1,
        key: "jsonn",
        val: "editer><",
        parent: false,
        id: '0000000000'
      }
    ];
    return {
      setIds: function(id, parent) {
        return ids[id] = parent;
      },
      getIds: function(id) {
        if (id != null) {
          return ids[id];
        } else {
          return ids;
        }
      },
      get: function() {
        return json;
      },
      size: function() {
        return json.length;
      },
      checkKey: function(key, id) {
        var existKey, j, sameId, _i, _len;
        for (_i = 0, _len = json.length; _i < _len; _i++) {
          j = json[_i];
          sameId = j.id === id;
          existKey = j.key === key;
          if (sameId && existKey) {
            return false;
          }
        }
        return true;
      },
      newId: function() {
        return id();
      },
      add: function(obj, issueId) {
        var containSpace_, nilKey;
        nilKey = this.checkKey(obj.key);
        containSpace_ = obj.val.match(/\s/);
        if (containSpace_) {
          if (!obj.val.match(/^"/)) {
            obj.val = obj.val.replace(/(　)+/g, " ");
            obj.val = obj.val.split(" ");
          }
        }
        if (nilKey) {
          if (first === true) {
            json.shift();
            first = false;
          }
          json.push(obj.hash());
        }
        return obj;
      },
      insert: function(idx, obj) {
        var containSpace_, len, t, tmp, _i, _len;
        len = this.size();
        tmp = json.slice(idx + 1, +len + 1 || 9e9);
        json.length = idx + 1;
        containSpace_ = obj.val.match(/\s/);
        if (containSpace_) {
          if (!obj.val.match(/^"/)) {
            obj.val = obj.val.replace(/(　)+/g, " ");
            obj.val = obj.val.split(" ");
          }
        }
        json[idx + 1] = obj.hash();
        for (_i = 0, _len = tmp.length; _i < _len; _i++) {
          t = tmp[_i];
          json.push(t);
        }
        return obj;
      },
      del: function(idx) {
        var af, len, t, _i, _len, _results;
        len = this.size();
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
              this.del(idx);
              return 3;
            } else {
              this.del(idx);
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
      setIds: function(id, layer) {
        ids = ids.slice(0, layer);
        return ids[layer - 1] = id;
      },
      getIds: function() {
        return ids;
      },
      decIds: function(num) {
        return ids = ids.slice(0, num);
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
    this.jsonTpl = "<ol class=\"json-ol {{pane.title}}\">\n  <li json-row _addFormTpl=\"\" ng-click=\"add()\" ng-repeat=\"json in jsons\" class=\"json-li\" ng-class=\"array_(json)\" data-index=\"{{$index}}\" data-type=\"json\" data-layer=\"{{json.layer}}\" data-parent=\"{{json.parent}}\" data-id=\"{{json.id}}\">\n    <span class=\"json-key json-edit json-layer{{json.layer}}\" ng-blur=\"update($index, $event, 'key')\" ng-keydown=\"key()\" contenteditable>{{json.key}}</span>\n    <span class=\"json-edit\" ng-class=\"{'json-parent':json.val == ''}\" ng-blur=\"update($index, $event, 'val')\" contenteditable>{{json.val == '' ? '{' : format(json.val)}}</span>\n  </li>\n  <li json-add-form id=\"main-form\" class=\"json-li json-li-form\" data-id=\"{{id()}}\" data-layer=\"{{layer()}}\" data-transfar=\"false\" data-parent=\"false\">\n    <input ng-model=\"key\" type=\"text\" class=\"json-new json-new-key json-layer{{layer()}}\" ng-keydown=\"keySc($event)\" autofocus>\n    <input ng-model=\"val\" type=\"text\" class=\"json-new json-new-val\" ng-focus=\"isFocus=true\" ng-blur=\"isFocus=false\" ng-keydown=\"valSc($event)\">\n  </li>\n</ul>";
    this.resultTpl = "<ol class=\"result-ol\">\n  <li class=\"result-li\"><div class=\"result-json\">{{json()}}</div></li>\n</ul>";
    this.addFormTpl = function(idx, layer, parent, id) {
      return "<li json-add-form id=\"insert-form\" class=\"json-li json-li-form\" data-original=\"" + idx + "\" data-layer=\"" + (parent === true ? layer + 1 : layer) + "\" data-parent=\"" + parent + "\" data-id=\"" + id + "\">\n  <input ng-model=\"key\" type=\"text\" class=\"json-new json-layer" + (parent === true ? layer + 1 : layer) + "\" ng-keydown=\"keySc($event)\" autofocus>\n  <input ng-model=\"val\" type=\"text\" class=\"json-new json-new-val\" ng-focus=\"isFocus=true\" ng-blur=\"isFocus=false\" ng-keydown=\"valSc($event)\">\n</li>";
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
                if (e.altKey === true) {
                  e.preventDefault();
                  angular.forEach(panes, function(pane) {
                    return pane.selected = false;
                  });
                  $scope.selected = panes[1];
                  panes[1].selected = true;
                  return $scope.$apply();
                }
                break;
              case 37:
                if (e.altKey === true) {
                  e.preventDefault();
                  angular.forEach(panes, function(pane) {
                    return pane.selected = false;
                  });
                  $scope.selected = panes[0];
                  panes[0].selected = true;
                  return $scope.$apply();
                }
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
            return Json.add(hash.key, hash.val);
          };
          return this;
        },
        link: function(scope, element, attrs, tabsCtrl) {
          tabsCtrl.addPane(scope);
          scope.pane = null;
          scope.select = function() {
            return scope.pane = tabsCtrl.getPane();
          };
          scope.jsons = Json.get();
          scope.id = function() {
            var ids;
            ids = Cache.getIds();
            if (ids.length === 0) {
              return '0000000000';
            } else {
              return ids[ids.length - 1];
            }
          };
          scope.array_ = function(json) {
            if (json.array === true) {
              return 'json-array';
            }
          };
          return scope.format = function(val) {
            if (!/^\"/.test(val)) {
              val = val.toString().replace(/\"/g, '');
            }
            val = val.toString().replace(/\[/g, '');
            val = val.toString().replace(/,/g, ' ');
            return val;
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
          var CreateJson, addChildEndJson, addParentEndJson, exPost, indent, initForm, pull, push;
          scope.key = '';
          scope.val = '';
          CreateJson = (function() {
            function CreateJson(id, layer, key) {
              this.id = id;
              this.layer = layer;
              this.key = key;
              this.val = '';
              this.parent = false;
              this.array = false;
            }

            CreateJson.prototype.hash = function() {
              return {
                id: this.id,
                layer: this.layer,
                key: this.key,
                val: this.val,
                parent: this.parent,
                array: this.array
              };
            };

            return CreateJson;

          })();
          scope.layer = function() {
            var ids;
            ids = Cache.getIds();
            if (element.context.dataset.parent === 'true' && element.context.dataset.transfar === 'false') {
              return ids.length + 1;
            } else {
              element.context.dataset.transfar = 'false';
              return ids.length;
            }
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
          scope.isId = scope.isId != null ? scope.isId : scope.$id;
          scope.isFocus = false;
          scope.getFocus = false;
          pull = function(e) {
            var id, layer;
            id = function() {
              id = Json.getIds(e.target.parentNode.dataset.id);
              console.log(id.prev);
              console.log(Json.getIds());
              if (id.prev == null) {
                return false;
              }
              e.target.parentNode.dataset.id = id.prev;
              console.log(e.target.parentNode.dataset.id);
              return true;
            };
            layer = function() {
              var allClass, cls, elClassList, ids, _i, _len;
              ids = Cache.getIds();
              Cache.decIds(ids.length - 1);
              if (e.target.previousElementSibling !== null) {
                elClassList = e.target.previousElementSibling.classList;
              } else {
                elClassList = e.target.classList;
              }
              allClass = elClassList.toString().match(/json-layer(\d)/g);
              for (_i = 0, _len = allClass.length; _i < _len; _i++) {
                cls = allClass[_i];
                if (cls === ("json-layer" + (ids + 1))) {
                  elClassList.remove(cls);
                  elClassList.add("json-layer" + (ids + 1));
                } else {
                  elClassList.remove(cls);
                }
              }
              console.log(e.target.parentNode.dataset.layer);
              e.target.parentNode.dataset.transfar = 'true';
              return e;
            };
            if (id()) {
              return layer();
            }
          };
          push = function(e) {
            var id, layer;
            id = function() {
              id = Json.getIds(e.target.parentNode.dataset.id);
              if (id.next === null) {
                e.target.parentNode.dataset.transfar = 'false';
                return false;
              }
              e.target.parentNode.dataset.id = id.next;
              return true;
            };
            layer = function() {
              var allClass, cls, currentLayer, elClassList, _i, _len, _results;
              currentLayer = parseInt(e.target.parentNode.dataset.layer);
              e.target.parentNode.dataset.layer = currentLayer + 1;
              if (e.target.previousElementSibling !== null) {
                elClassList = e.target.previousElementSibling.classList;
              } else {
                elClassList = e.target.classList;
              }
              allClass = elClassList.toString().match(/json-layer(\d)/g);
              _results = [];
              for (_i = 0, _len = allClass.length; _i < _len; _i++) {
                cls = allClass[_i];
                if (cls === ("json-layer" + currentLayer)) {
                  elClassList.remove(cls);
                  _results.push(elClassList.add("json-layer" + (currentLayer + 1)));
                } else {
                  _results.push(elClassList.remove(cls));
                }
              }
              return _results;
            };
            if (id()) {
              return layer();
            }
          };
          initForm = function() {
            scope.key = '';
            return scope.val = '';
          };
          exPost = function(json, element) {
            console.log(element);
            element.context.children[0].focus();
            return initForm();
          };
          indent = function(nextId) {
            var layer, next_, sameLayer_, transfar_;
            layer = parseInt(element.context.dataset.layer);
            next_ = element.context.previousElementSibling.dataset.id === element.context.dataset.id;
            sameLayer_ = element.context.previousElementSibling.dataset.layer === element.context.dataset.layer;
            transfar_ = element.context.dataset.transfar === 'true';
            if (element.context.previousElementSibling.dataset.parent === 'true' && next_ && sameLayer_) {
              layer++;
              element.context.dataset.layer = layer;
              console.log(1);
            } else if (element.context.previousElementSibling.dataset.parent === 'true' && !next_ && sameLayer_ && transfar_) {
              element.context.dataset.layer = layer;
            } else if (element.context.previousElementSibling.dataset.parent === 'true' && !next_ && sameLayer_ && !transfar_) {
              element.context.dataset.layer = layer;
              console.log(3);
            }
            return layer;
          };
          addChildEndJson = function(json) {
            json.val = scope.val;
            json.id = element.context.dataset.id;
            json.layer = indent(json.id);
            Json.add(json);
            return $timeout(function() {
              return exPost(json, element);
            }, 1);
          };
          addParentEndJson = function(json, e) {
            var prev, prevData, result, _id;
            prev = {
              prev: element.context.dataset.id,
              next: null,
              layer: element.context.dataset.layer
            };
            json.id = Json.newId();
            prevData = Json.getIds(prev.prev);
            json.layer = indent(json.id);
            prevData.next = json.id;
            Json.setIds(json.id, prev);
            json.parent = true;
            if (json.key === '[') {
              json.array = true;
            }
            result = Json.add(json);
            element.context.dataset.parent = 'true';
            _id = element.context.dataset.id;
            Cache.setIds(result.id, element.context.dataset.layer);
            return $timeout(function() {
              return exPost(json, element);
            }, 1);
          };
          scope.valSc = function(e) {
            var focus_, idx, key_, nilKey, prev, prevData, sameScope_, val_, _json;
            switch (e.keyCode) {
              case 9:
              case 78:
                if (e.keyCode === 9) {
                  e.preventDefault();
                }
                if (e.keyCode === 78) {
                  if (e.altKey !== true) {
                    return;
                  }
                }
                key_ = scope.key !== '';
                val_ = scope.val !== '';
                focus_ = scope.isFocus === true;
                sameScope_ = scope.isId === scope.$id;
                if (focus_ && key_) {
                  _json = new CreateJson(element.data('id'), element.data('layer'), scope.key);
                  if (sameScope_) {
                    nilKey = Json.checkKey(_json.key, _json.id);
                    if (nilKey) {
                      if (val_) {
                        addChildEndJson(_json);
                      }
                      if (!val_) {
                        return addParentEndJson(_json, e);
                      }
                    }
                  } else {
                    nilKey = Json.checkKey(_json.key, _json.id);
                    idx = parseInt(element.context.dataset.original);
                    if (nilKey) {
                      if (val_) {
                        _json.val = scope.val;
                      } else {
                        _json.id = Json.newId();
                        prev = {
                          prev: element.context.dataset.id,
                          next: null,
                          layer: element.context.dataset.layer
                        };
                        prevData = Json.getIds(prev.prev);
                        prevData.next = _json.id;
                        Json.setIds(_json.id, prev);
                        _json.parent = true;
                      }
                      Json.insert(idx, _json);
                      _json = new CreateJson;
                      return $timeout(function() {
                        return element[0].remove();
                      }, 1);
                    }
                  }
                }
                break;
              case 72:
                if (e.altKey === true) {
                  return pull(e);
                }
                break;
              case 76:
                if (e.altKey === true) {
                  return push(e);
                }
            }
          };
          return scope.keySc = function(e) {
            switch (e.keyCode) {
              case 72:
                if (e.altKey === true) {
                  return pull(e);
                }
                break;
              case 76:
                if (e.altKey === true) {
                  return push(e);
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
            var array_, close, json, layer, len, result;
            json = Json.get();
            len = Json.size();
            layer = 0;
            array_ = false;
            result = '';
            close = function(num) {
              var tmp;
              tmp = '';
              while (num--) {
                tmp += '}';
              }
              return tmp;
            };
            angular.forEach(json, function(v) {
              var gap, i, isNumber_, parent_, sameLayer_, size, tmp, up, val, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
              parent_ = v.parent;
              sameLayer_ = layer === v.layer;
              isNumber_ = isNaN(Number(v.val)) === true;
              if (sameLayer_) {
                result += ',';
                if (parent_) {
                  return result += "\"" + v.key + "\":{";
                } else {
                  if (isNumber_) {
                    if (v.val.toString().match(/,/)) {
                      tmp = '';
                      i = 0;
                      size = v.val.length;
                      _ref = v.val;
                      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                        val = _ref[_i];
                        i++;
                        if (isNaN(Number(val)) === true) {
                          tmp += "\"" + val + "\"";
                        } else {
                          tmp += val;
                        }
                        if (i !== size) {
                          tmp += ',';
                        }
                      }
                      return result += "\"" + v.key + "\":[" + tmp + "]";
                    } else {
                      return result += "\"" + v.key + "\":\"" + v.val + "\"";
                    }
                  } else {
                    return result += "\"" + v.key + "\":" + v.val;
                  }
                }
              } else {
                up = v.layer > layer;
                if (up) {
                  layer = v.layer;
                  if (parent_) {
                    if (v.key === '[') {
                      result += "" + v.key + "{";
                      return array_ = true;
                    } else {
                      return result += "\"" + v.key + "\":{";
                    }
                  } else {
                    if (isNumber_) {
                      if (v.val.toString().match(/,/)) {
                        tmp = '';
                        i = 0;
                        size = v.val.length;
                        _ref1 = v.val;
                        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
                          val = _ref1[_j];
                          i++;
                          if (isNaN(Number(val)) === true) {
                            tmp += "\"" + val + "\"";
                          } else {
                            tmp += val;
                          }
                          if (i !== size) {
                            tmp += ',';
                          }
                        }
                        return result += "\"" + v.key + "\":[" + tmp + "]";
                      } else {
                        return result += "\"" + v.key + "\":\"" + v.val + "\"";
                      }
                    } else {
                      return result += "\"" + v.key + "\":" + v.val;
                    }
                  }
                } else {
                  parent_ = v.parent;
                  gap = layer - v.layer;
                  layer = v.layer;
                  if (array_) {
                    result += close(gap) + ']' + ',';
                  } else {
                    result += close(gap) + ',';
                  }
                  if (parent_) {
                    return result += "\"" + v.key + "\":{";
                  } else {
                    if (isNumber_) {
                      if (v.val.toString().match(/,/)) {
                        tmp = '';
                        i = 0;
                        size = v.val.length;
                        _ref2 = v.val;
                        for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
                          val = _ref2[_k];
                          i++;
                          if (isNaN(Number(val)) === true) {
                            tmp += "\"" + val + "\"";
                          } else {
                            tmp += val;
                          }
                          if (i !== size) {
                            tmp += ',';
                          }
                        }
                        return result += "\"" + v.key + "\":[" + tmp + "]";
                      } else {
                        return result += "\"" + v.key + "\":\"" + v.val + "\"";
                      }
                    } else {
                      return result += "\"" + v.key + "\":\"" + v.val + "\"";
                    }
                  }
                }
              }
            });
            if (array_) {
              return result + close(json[len - 1].layer - 1) + ']';
            } else {
              return '{' + result + close(json[len - 1].layer);
            }
          };
        },
        template: Tpl.resultTpl,
        replace: true
      };
    }
  ]);

}).call(this);

/*
//# sourceMappingURL=../../dist/js/jsonn2.js.map
*/