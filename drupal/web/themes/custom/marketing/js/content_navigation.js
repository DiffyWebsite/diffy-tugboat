(function ($, Drupal) {
  Drupal.behaviors.contentNavigationBehavior = {
    popParent: function(header, pathStack) {
      if (header.text() == 'Шлях стажера: Binary Studio Academy') {
        debugger;
      }
      do {
        parentLevel = pathStack.pop();
      } while (this.getLevelNumber(header) <= this.getLevelNumber(parentLevel));

      return parentLevel;
    },

    getLevelNumber: function(header) {
      if (!header) {
        debugger;
      }
      var tagName = header.prop('tagName');
      return +tagName[1];
    },

    addTo: function(subject, object) {
      var levelContainer = subject.data('levelContainer');
      if (!levelContainer) {
        levelContainer = [];
        subject.data('levelContainer', levelContainer);
      }
      levelContainer.push(object);
    },

    generateDom: function(header) {
      var _this = this;
      var levelContainer = header.data('levelContainer');
      if (!levelContainer) {
        return;
      }
      var ul = $('<ul>');
      levelContainer.forEach(function (_header) {
        var li = $('<li>')
          .append(
            $('<div>')
              .addClass('title')
              .text(_header.text())
          )
          .click(function(event) {
            event.stopPropagation();
            var $this = $(this);
            var header = $this.data('header');
            $('html, body').animate({
              scrollTop: header.offset().top
            }, 1000);
          })
          .data('header', _header)
          .appendTo(ul);

        var subUl = _this.generateDom(_header);
        if (subUl) {
          subUl.appendTo(li);
        }
      });

      return ul;
    },

    getTopVirtualContainer: function(documentation) {
      var _this = this;
      var virtualTopContainer = previousHeader = parentLevel = $('<h0>');
      var headers = $(':header', documentation);
      var pathStack = [];
      headers.each(function() {
        var header = $(this);
        var elementLevelNumber = _this.getLevelNumber(header);
        var previousHeaderNumber =_this.getLevelNumber(previousHeader);
        if (elementLevelNumber > previousHeaderNumber) {
          // Down.
          pathStack.push(previousHeader);
          parentLevel = previousHeader;
        }
        else if (elementLevelNumber < previousHeaderNumber) {
          // Up.
          parentLevel = _this.popParent(header, pathStack);
        }
        _this.addTo(parentLevel, header);
        previousHeader = header;
      });

      return virtualTopContainer;
    },

    attach: function (context, settings) {
      var documentation = $('.documentation_content').once('processed').get(0);
      var navigation = $('.content_navigation').once('processed').get(0);
      if (!documentation) {
        // There are not content to process.
        return;
      }
      var virtualTopContainer = this.getTopVirtualContainer(documentation);
      var menuTree = this.generateDom(virtualTopContainer);
      if (menuTree) {
        menuTree.appendTo(navigation);
      }
    }
  };

})(jQuery, Drupal);
