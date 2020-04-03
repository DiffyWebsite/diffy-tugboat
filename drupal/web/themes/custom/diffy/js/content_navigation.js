(function ($, Drupal) {
  Drupal.behaviors.contentNavigationBehavior = {
    active: undefined,
    popParent: function(header, pathStack) {
      do {
        parentLevel = pathStack.pop();
      } while (this.getLevelNumber(header) <= this.getLevelNumber(parentLevel));

      return parentLevel;
    },

    getLevelNumber: function(header) {
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

    /**
     * Builds tree DOM presentation.
     */
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
          .data('header', _header)
          .click(function(event) {
            event.stopPropagation();
            var $this = $(this);
            var header = $this.data('header');
            $('html, body').animate({
              scrollTop: header.offset().top - 99
            }, 1000);
          })
          .appendTo(ul);

        _header.data('menu-item-dom', li);
        var subUl = _this.generateDom(_header);
        if (subUl) {
          subUl.appendTo(li);
        }
      });

      return ul;
    },

    /**
     * Transforms flat list of headers to the tree presentation.
     */
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
      var _this = this;
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
      _this.active = $('ul > li:first', navigation);
      if (_this.active.length > 0) {
        _this.active.addClass('is-active');
      }

      var headers = $(':header', documentation);
      // It keeps section tracking while scrolling.
      $(window).scroll(function() {
        var top = $(window).scrollTop();
        var currentHeader = headers.toArray().find(function(header) {
          var elementTop = $(header).offset().top;
          return elementTop > top && elementTop - 200 < top;
        });
        if (!currentHeader) {
          return;
        }
        var $currentHeader = $(currentHeader);
        var $currentElementMenu = $currentHeader.data('menu-item-dom');
        if (!!$currentHeader && !$currentElementMenu.hasClass('is-active')) {
          _this.active.removeClass('is-active');
          _this.active = $currentElementMenu;
          _this.active.addClass('is-active');
        }
      })
    }
  };

})(jQuery, Drupal);
