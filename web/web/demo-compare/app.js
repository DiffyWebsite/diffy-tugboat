const routes = [
    {
        path: '/',
        name: 'view-diff',
        meta: {
            title: "View Diff",
        }
    },
    {
        path: '/single/:index/:breakpoint',
        name: 'diff-detail',
        meta: {
            title: "Diff Detail",
        }
    }
];

const router = new VueRouter({
    routes // short for `routes: routes`
});

var app = new Vue({
    el: '#app',
    router,
    data: {
        diffId: 7532,
        detailedMode: false,
        detailedIndex: 0,
        detailedBreakpoint: 640,
        changed: 1,
        diffName: "4\x20Apr\x20Prod\x20vs.\x20Stage",
        env1: "production",
        env2: "staging",
        env1Url: "http\x3A\x2F\x2Fwordpress.diffy.website",
        env2Url: "http\x3A\x2F\x2Fstage.wordpress.diffy.website",
        diffs: {
   "\/2019\/03\/01\/delectus-quia-esse-aut":{
      "1200":{
         "diff":{
            "score":2973,
            "full":"images\/8679049581674212_1554416970_diff.png",
            "thumbnail":"images\/8679049581674212_1554416970_diff.png"
         },
         "idiff":{
            "score":2973,
            "full":"images\/diff-2051778470836436992.png",
            "thumbnail":"images\/diff-2051778470836436992.png"
         }
      }
   },
   "\/2019\/02\/12\/qui-officia-et-veniam-sit-quibusdam-non":{
      "1200":{
         "diff":{
            "score":1317,
            "full":"images\/7311136893434886_1554416987_diff.png",
            "thumbnail":"images\/7311136893434886_1554416987_diff.png"
         },
         "idiff":{
            "score":1317,
            "full":"images\/diff-7820211010140110848.png",
            "thumbnail":"images\/diff-7820211010140110848.png"
         }
      }
   }
},
        snapshot1: {
   "\/2019\/03\/01\/delectus-quia-esse-aut":{
      "1200":{
         "full":"images\/screenshot-1554416948-503467846.png",
         "thumbnail":"images\/screenshot-1554416948-503467846.png"
      }
   },
   "\/2019\/02\/12\/qui-officia-et-veniam-sit-quibusdam-non":{
      "1200":{
         "full":"images\/screenshot-1554416948-644406957.png",
         "thumbnail":"images\/screenshot-1554416948-644406957.png"
      }
   }
},
        snapshot2: {
   "\/2019\/03\/01\/delectus-quia-esse-aut":{
      "1200":{
         "full":"images\/screenshot-1554416967-703153121.png",
         "thumbnail":"images\/screenshot-1554416967-703153121.png"
      }
   },
   "\/2019\/02\/12\/qui-officia-et-veniam-sit-quibusdam-non":{
      "1200":{
         "full":"images\/screenshot-1554416984-133980275.png",
         "thumbnail":"images\/screenshot-1554416984-133980275.png"
      }
   }
},
        pixelPerfect: false,
        projectName: "Demo\x20test\x20project",
        projectId: 0
    },
    computed: {
        breakpoints: function () {
            let breakpoints = [];
            for (let url in this.diffs) {
                for (let breakpoint in this.diffs[url]) {
                    // Both diff and idiff completed.
                    let keysNumber = Object.keys(this.diffs[url][breakpoint]).length;
                    let score = (this.diffs[url][breakpoint].diff) ? this.diffs[url][breakpoint].diff.score : 0;
                    if (keysNumber == 2 && score > 0) {
                        if (breakpoints.indexOf(breakpoint) === -1) {
                            breakpoints.push(breakpoint);
                        }
                    }
                }
            }

            if (breakpoints.length) {
                this.detailedBreakpoint = breakpoints[0];
            }

            return breakpoints;
        },
        images: function() {
            const breakpoints = this.breakpoints;
            let items = {};
            let formattedItems = {};
            let changedUrls = {};
            // Get all items with score > 0
            for (let index in breakpoints) {
                let breakpoint = breakpoints[index];
                for (let url in this.diffs) {
                    // Both diff and idiff completed.
                    if (
                        this.diffs[url].hasOwnProperty(breakpoint) &&
                        this.diffs[url][breakpoint].hasOwnProperty('diff')
                    ) {
                        let keysNumber = Object.keys(this.diffs[url][breakpoint]).length;
                        let score = (this.diffs[url][breakpoint].diff.hasOwnProperty('score')) ? this.diffs[url][breakpoint].diff.score : 0;
                        if (keysNumber == 2 && score > 0) {
                            let item = {
                                url: this.env1Url.replace(/\/*$/, '') + '/' +  url.replace(/^\/*/, ''),
                                urlPath: url.replace(this.env1Url, ''),
                                image: this.diffs[url][breakpoint].idiff.thumbnail
                            };
                            if (items[url] == undefined) {
                                items[url] = {};
                            }
                            items[url][breakpoint] = item;
                            changedUrls[url] = url;
                        }
                    }
                }
            }

            // Prepare items key based on url position.
            for (let url in items) {
                let i = Object.keys(items).indexOf(url);
                for (let breakpoint in items[url]) {
                    if (formattedItems[breakpoint] == undefined) {
                        formattedItems[breakpoint] = {};
                    }
                    formattedItems[breakpoint][i] = items[url][breakpoint];
                }
            }

            this.changed = Object.keys(changedUrls).length;

            const {index, breakpoint} = this.$route.params;

            if (typeof index !== 'undefined' && typeof breakpoint !== 'undefined' ) {
                if (this.url(index, breakpoint)) {
                    this.setDetailedIndex(this.url(index), breakpoint);
                }
            } else {
                this.detailedMode = false;
            }

            return formattedItems;
        },
        detailedImages: function() {
            const breakpoints = this.breakpoints;
            let items = {};
            for (let index in breakpoints) {
                const breakpoint = breakpoints[index];
                for (let url in this.diffs) {
                    // Both diff and idiff completed.
                    if (
                        this.diffs[url].hasOwnProperty(breakpoint) &&
                        this.diffs[url][breakpoint].hasOwnProperty('diff')
                    ) {
                        let keysNumber = Object.keys(this.diffs[url][breakpoint]).length;
                        let score = (this.diffs[url][breakpoint].diff.hasOwnProperty('score')) ? this.diffs[url][breakpoint].diff.score : 0;
                        if (keysNumber == 2 && score > 0) {
                            if (items[url] == undefined) {
                                items[url] = {};
                            }
                            let item = {
                                idiff: this.diffs[url][breakpoint].idiff.full,
                                diff: this.diffs[url][breakpoint].diff.full
                            };
                            items[url][breakpoint] = item;
                        }
                    }
                }
            }
            return items;
        },
        total: function() {
            return Object.keys(this.diffs).length;
        },
        detailedBreakpointList: function () {
            const urlIndex = this.url(this.detailedIndex);
            let breakpoints = [];

            for (var breakpoint in this.detailedImages[urlIndex]) {
                breakpoints.push(breakpoint);
            }

            return breakpoints;
        },
        snapshot1Image: function() {
            const urlIndex = this.url(this.detailedIndex);
            if (this.snapshot1[urlIndex] !== undefined &&
                this.snapshot1[urlIndex].hasOwnProperty(this.detailedBreakpoint) &&
                this.snapshot1[urlIndex][this.detailedBreakpoint].hasOwnProperty('full')
            ) {
                return this.snapshot1[urlIndex][this.detailedBreakpoint].full;
            }
            return '';
        },
        snapshot2Image: function() {
            const urlIndex = this.url(this.detailedIndex);
            if (this.snapshot2[urlIndex] !== undefined &&
                this.snapshot2[urlIndex].hasOwnProperty(this.detailedBreakpoint) &&
                this.snapshot2[urlIndex][this.detailedBreakpoint].hasOwnProperty('full')
            ) {
                return this.snapshot2[urlIndex][this.detailedBreakpoint].full;
            }
            return '';
        },
        getEnv1PageUrl: function() {
            const urlIndex = this.url(this.detailedIndex);
            return this.env1Url.replace(/\/*$/, '') + '/' +  urlIndex.replace(/^\/*/, '');

        },
        getEnv2PageUrl: function() {
            const urlIndex = this.url(this.detailedIndex);
            return this.env2Url.replace(/\/*$/, '') + '/' +  urlIndex.replace(/^\/*/, '');

        },
        labelLeft: function() {
            const split = this.diffName.split(' vs. ');
            return split[0];
        },
        labelRight: function() {
            const split = this.diffName.split(' vs. ');
            return split[1];
        },
        detailedUri: function() {
            const keys = Object.keys(this.detailedImages);
            return keys[this.detailedIndex];
        }
    },
    mounted: function () {
        setTimeout(function () {
            $('.content .nav-pills li:first a').click();
        }, 1000);

    },
    methods: {
        getPrevNextBreakpoint: function (index) {
            const uri = this.url(index);
            if (!uri) {
                return;
            }
            const diffBreakpoint = this.detailedImages[uri];

            if (diffBreakpoint[this.detailedBreakpoint] && diffBreakpoint[this.detailedBreakpoint].diff) {
                return this.detailedBreakpoint;
            } else {
                const availableBreakpoints = Object.keys(diffBreakpoint);
                return (availableBreakpoints.length) ? availableBreakpoints[0] : false;
            }
        },
        deviceIcon: function(breakpoint) {
            if (breakpoint < 1000) {
                return 'phone_iphone';
            }
            if (breakpoint < 1300) {
                return 'tablet_mac';
            }
            return 'laptop';
        },
        diffImageDiff: function(index, breakpoint) {
            const urlIndex = this.url(index);
            if (this.detailedImages[urlIndex] !== undefined) {
                return (this.detailedImages[urlIndex] && this.detailedImages[urlIndex][breakpoint] && this.detailedImages[urlIndex][breakpoint].diff) ? this.detailedImages[urlIndex][breakpoint].diff : '';
            }
            return false;
        },
        diffImageiDiff: function(index, breakpoint) {
            const urlIndex = this.url(index);
            if (this.detailedImages[urlIndex] !== undefined) {
                return (this.detailedImages[urlIndex] && this.detailedImages[urlIndex][breakpoint] && this.detailedImages[urlIndex][breakpoint].idiff) ? this.detailedImages[urlIndex][breakpoint].idiff : '';
            }
            return false;
        },
        setDetailedIndex: function (url, breakpoint) {
            let i;
            this.detailedBreakpoint = breakpoint;
            this.detailedMode = true;
            for (i = 0; i < this.changed; i++) {
                if (this.url(i) == url) {
                    this.detailedIndex = i;
                    return;
                }
            }
        },
        url: function (index, breakpoint = false) {
            let i = 0;
            for (let urlIndex in this.detailedImages) {
                if (i == index) {
                    if (breakpoint) {
                        if (this.detailedImages[urlIndex].hasOwnProperty(breakpoint)) {
                            return urlIndex;
                        }
                    } else {
                        return urlIndex;
                    }
                }
                i++;
            }
            return false;
        }
    },
    watch: {
        detailedBreakpoint: function (val) {
            // refresh twentytwenty after change breakpoint.
            setTimeout(function () {
                $(window).trigger("resize.twentytwenty");
            }, 1000);

        },
        detailedMode: function(val) {
            if (val == true) {
                setTimeout(function () {
                    $(".twentytwenty-container").twentytwenty();
                    setTimeout(function () {
                        $(window).trigger("resize.twentytwenty");
                    }, 1000);
                }, 1000);
            }
        }
    }
});

