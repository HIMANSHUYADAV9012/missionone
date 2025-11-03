var FUNNEL_ID = document.head.querySelector("meta[name=funnel_id]").content;
var FUNNEL_PAGE_ID = document.head.querySelector("meta[name=funnel_page_id]")
    .content;
var CATEGORY_ID = document.head.querySelector("meta[name=category_id]").content;
var FLEXITOKEN = "flexiToken_" + FUNNEL_ID;
var API_BASE_URL = "https://api.flexifunnels.com/";

let param = new URL(document.location).searchParams;
var tk = param.get("tk");
console.log(tk);
if (tk !== null) {
    console.log("ajvrt");
    localStorage.setItem(FLEXITOKEN, tk);
    console.log(localStorage.getItem("loginreload"));
    if (localStorage.getItem("loginreload") == null) {
        localStorage.setItem("loginreload", tk);
        location.reload();
    }
}
function injectoverCss() {
    var css = // iframe blocker to catch mouse events
        ".video-js .vjs-overlay-background {background-color: #646464a3;border-radius: 3px;padding: 10px 15px;font-size: 12px;font-weight: 600;}" +
        ".video-js .vjs-overlay-center-center{top:50%;left:50%;transform: translate(-50%, -50%);";

    var head = document.head || document.getElementsByTagName("head")[0];

    var style = document.createElement("style");
    style.type = "text/css";

    if (style.styleSheet) {
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }

    head.appendChild(style);
}
if (CATEGORY_ID == 17 || CATEGORY_ID == 38) {
    document.addEventListener("contextmenu", event => event.preventDefault());
    document.onkeydown = function(e) {
        if (event.keyCode == 123) {
            return false;
        }
        if (e.ctrlKey && e.shiftKey && e.keyCode == "I".charCodeAt(0)) {
            return false;
        }
        if (e.ctrlKey && e.shiftKey && e.keyCode == "C".charCodeAt(0)) {
            return false;
        }
        if (e.ctrlKey && e.shiftKey && e.keyCode == "J".charCodeAt(0)) {
            return false;
        }
        if (e.ctrlKey && e.keyCode == "U".charCodeAt(0)) {
            return false;
        }
    };
}

if (CATEGORY_ID == 17) {
    injectoverCss();
}
var app = angular.module("membership", []);
app.service("dataService", function($http) {
    delete $http.defaults.headers.common["X-Requested-With"];
    this.getData = function(url, postdata, callbackFunc) {
        $http({
            url: url,
            method: "POST",
            data: postdata,
            headers: {
                Authorization: "Bearer " + localStorage.getItem(FLEXITOKEN)
            }
        }).then(function(response) {
            callbackFunc(response);
        });
    };
});
app.filter("to_trusted", [
    "$sce",
    function($sce) {
        return function(text) {
            if (typeof text == "undefined") return "";
            return $sce.trustAsHtml(text);
        };
    }
]);
app.controller("membershipCtrl", [
    "$scope",
    "$http",
    "dataService",
    "$window",
    function($scope, $http, dataService, $window) {
        $scope.courseSel = 0;
        $scope.lessionSel = 0;
        $scope.lessionIndex = 0;
        $scope.courseIndex = 0;
        $scope.fb_cmd_mode = 0;
        $scope.courseContent = "";
        $scope.fb_sdkcode = "";
        $scope.courseMenuSel = function(index) {
            $scope.courseSel = index;
            console.log($scope.courseSel);
        };

        $scope.parJson = function(json) {
            if (typeof json != "undefined") {
                return JSON.parse(json);
            }
        };

        function makeid(length) {
            var result = "";
            var characters =
                "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            var charactersLength = characters.length;
            for (var i = 0; i < length; i++) {
                result += characters.charAt(
                    Math.floor(Math.random() * charactersLength)
                );
            }
            return result;
        }
        // function getMachineId() {    
        //     let machineId = localStorage.getItem('FfMsMachineId');            
        //     if (!machineId) {
        //         machineId = crypto.randomUUID();
        //         localStorage.setItem('FfMsMachineId', machineId);
        //     }        
        //     return machineId;
        // }
        function random_item(items) {
            return items[Math.floor(Math.random() * items.length)];
        }
        function appendContent($pObj) {
            var fbCode = "";
            $scope.fb_fbcomments = "";
            if ($pObj.lesson_type == 1 && $pObj.video_type !== null) {
                // $pObj.video_id = "1Zamz94ZMCM";

                var video, videoUrl, videoType, lessonVideoId, videoId, ranId;
                ranId = makeid(4);
                lessonVideoId = "lessonVide_" + $pObj.lesson_id + "_" + ranId;
                videoId = $pObj.video_id;
                if ($pObj.show == 1) {
                    var completeBtn = `<button type="submit" class="btn btn-primary ft-mkcomplete" ><i class="far fa-check-circle course_icon ml-auto"></i> Completed</button>`;
                } else {
                    var completeBtn = `<button type="submit" class="btn btn-primary ft-mkcomplete" >Mark as complete</button>`;
                }
                if ($pObj.resourcemode == 1) {
                    var downloadBtn = `<a href="javascript:void(0);" class="btn btn-primary mr-3 ft-download">Download Resources</a>`;
                } else {
                    var downloadBtn = ``;
                }
                var tempHtml = "<div>" + $pObj.html + "</div>";
                if ($pObj.video_type == "youtube") {
                    video =
                        '<video  id="' +
                        lessonVideoId +
                        '" class="video-js vjs-default-skin vjs-layout-medium vjs-big-play-centered mb-3" controls  width="640" height="264"></video><div id="ff-mem-btnsection" class="row"><div class="col d-flex align-items-center ff-mbrship1-hidemob-showdesk"><h5 class="mb-0"></h5></div><div class="col text-right">' +
                        downloadBtn +
                        completeBtn +
                        "</div></div>";
                    ($style = `<style type='text/css'">${$pObj.css}</style>`),
                        $(".ft-crs-lsn-tabcntnt")
                            .children()
                            .remove(),
                        $(".ft-crs-lsn-tabcntnt")
                            // .append($style)
                            // .delay(400)
                            .append(video)
                            .delay(400)
                            .append(tempHtml);
                    videoUrl = "https://www.youtube.com/watch?v=" + videoId;
                    videoType = "video/youtube";
                    var myPlayer = videojs(lessonVideoId, {
                        controls: true,
                        responsive: true,
                        aspectRatio: "16:9",
                        fluid: true,
                        playbackRates: [0.5, 1, 1.5, 2],
                        sources: [
                            {
                                src: videoUrl,
                                type: videoType
                            }
                        ],
                        techOrder: ["youtube", "html5"]
                    });
                    // myPlayer.one("loadedmetadata", () => {
                    //     var items = [
                    //         "top-left",
                    //         "top",
                    //         "top-right",
                    //         "right",
                    //         "bottom-right",
                    //         "bottom",
                    //         "bottom-left",
                    //         "left",
                    //         "center-center",
                    //     ];
                    //     var duration = myPlayer.duration();
                    //     var arr = [];
                    //     var intervel = 10;
                    //     for (var i = 0; i < duration; i += intervel) {
                    //         var data = {
                    //             start: i,
                    //             end: i + 7,
                    //             align: random_item(items),
                    //         };
                    //         arr.push(data);
                    //     }
                    //     myPlayer.overlay({
                    //         content: $scope.msName + "<br/ >" + $scope.msEmail,
                    //         debug: false,
                    //         align: "bottom-left",
                    //         showBackground: true,
                    //         attachToControlBar: false,
                    //         overlays: arr,
                    //     });
                    // });
                    myPlayer.on("playing", function() {
                        $(".vjs-big-play-button").removeClass("ftplayBtn");
                        $(".vjs-big-play-button").addClass("ftpauseBtn");
                    });

                    myPlayer.on("pause", function() {
                        $(".vjs-big-play-button").removeClass("ftpauseBtn");
                        $(".vjs-big-play-button").addClass("ftplayBtn");
                    });

                    myPlayer.ready(function() {
                        $(".vjs-big-play-button").addClass("ftplayBtn");
                        $(document).on("click", ".ftpauseBtn", function() {
                            myPlayer.pause();
                            $(".vjs-big-play-button").removeClass("ftpauseBtn");
                            $(".vjs-big-play-button").addClass("ftplayBtn");
                        });
                        $(document).on("click", ".ftplayBtn", function() {
                            $(".vjs-big-play-button").removeClass("ftplayBtn");
                            $(".vjs-big-play-button").addClass("ftpauseBtn");
                            myPlayer.play();
                        });
                    });

                    // myPlayer.overlay({
                    //     content: "Default overlay content",
                    //     debug: true,
                    //     // overlays: [{
                    //     //   content: 'The video is playing!',
                    //     //   start: 'play',
                    //     //   end: 'pause'
                    //     // },
                    //     // {
                    //     //   start: 0,
                    //     //   end: 15,
                    //     //   align: 'bottom-left'
                    //     // }, {
                    //     //   start: 15,
                    //     //   end: 30,
                    //     //   align: 'bottom'
                    //     // }, {
                    //     //   start: 30,
                    //     //   end: 45,
                    //     //   align: 'bottom-right'
                    //     // }, {
                    //     //   start: 20,
                    //     //   end: 'pause'
                    //     // }]
                    // });
                } else if ($pObj.video_type == "vimeo") {
                    // videoUrl = "https://vimeo.com/" + videoId;
                    videoType = "vimeo";
                    videoUrl = "https://player.vimeo.com/video/" + videoId;
                    video =
                        '<div class="row"><div class="embed-responsive embed-responsive-16by9"><iframe src="' +
                        videoUrl +
                        '" width="100%" height="400" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div></div><div id="ff-mem-btnsection" class="row mt-3"><div class="col d-flex align-items-center ff-mbrship1-hidemob-showdesk"><h5 class="mb-0"></h5></div><div class="col text-right">' +
                        downloadBtn +
                        completeBtn +
                        "</div></div>";
                    ($style = `<style type='text/css'">${$pObj.css}</style>`),
                        $(".ft-crs-lsn-tabcntnt")
                            .children()
                            .remove(),
                        $(".ft-crs-lsn-tabcntnt")
                            // .append($style)
                            // .delay(400)
                            .append(video)
                            .delay(400)
                            .append(tempHtml);
                } else if ($pObj.video_type == "flexi") {
                    if ($pObj.drm_mode == 1 && $pObj.video_status == 1) {
                        videoType = "flexi";
                        videoUrl = $pObj.embed;
                        video =
                            '<div class="row"><div class="embed-responsive embed-responsive-16by9">' +
                            videoUrl +
                            "</div>" +
                            '<div class="col pr-0 mt-3 text-right">' +
                            downloadBtn +
                            completeBtn +
                            "</div></div>";
                        ($style = `<style type='text/css'">${$pObj.css}</style>`),
                            $(".ft-crs-lsn-tabcntnt")
                                .children()
                                .remove(),
                            $(".ft-crs-lsn-tabcntnt")
                                // .append($style)
                                // .delay(400)
                                .append(video)
                                .delay(400)
                                .append(tempHtml);
                    } else if ($pObj.drm_mode == 1 && $pObj.video_status == 2) {
                        var currentlink = "";
                        // var pattern = /^\b[A-Z0-9._%-]+[^@]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i;
                        var getLink = $pObj.support;
                        console.log("one", $pObj.support);
                        if (
                            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
                                $pObj.support
                            )
                        ) {
                            var getLink = $pObj.support;
                            currentlink = `<a style="color: #fff;
                             font-size: 20px;
                             text-decoration: underline;" href="mailto:${getLink}">${getLink}</a>`;
                        } else {
                            currentlink = `<a style="color: #fff;
                            font-size: 20px;
                            text-decoration: underline;" href="${getLink}" target="_blank">${getLink}</a>`;
                        }
                        var restrictedMsg = `<div>
                        <div class="page403">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" viewBox="0 0 24 24" width="100px" height="100px" class="whistle">    <path d="M 12 1 C 8.6761905 1 6 3.6761905 6 7 L 6 8 C 4.9 8 4 8.9 4 10 L 4 20 C 4 21.1 4.9 22 6 22 L 18 22 C 19.1 22 20 21.1 20 20 L 20 10 C 20 8.9 19.1 8 18 8 L 18 7 C 18 3.6761905 15.32381 1 12 1 z M 12 3 C 14.27619 3 16 4.7238095 16 7 L 16 8 L 8 8 L 8 7 C 8 4.7238095 9.7238095 3 12 3 z M 12 13 C 13.1 13 14 13.9 14 15 C 14 16.1 13.1 17 12 17 C 10.9 17 10 16.1 10 15 C 10 13.9 10.9 13 12 13 z"/></svg>
                        <h1>403</h1>
                        <h2 style="text-transform:inherit">This video is not available.<br/> Please contact the vendor at <br/> <span> ${currentlink} </span ></h2>
                    </div>
                        </div>`;
                        $(".ft-crs-lsn-tabcntnt")
                            .children()
                            .remove(),
                            $(".ft-crs-lsn-tabcntnt").append(restrictedMsg);
                    } else if ($pObj.drm_mode == 1 && $pObj.video_status == 0) {
                        var restrictedMsg = `<div>
                        <div class="page403">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" viewBox="0 0 24 24" width="100px" height="100px" class="whistle">    <path d="M 12 1 C 8.6761905 1 6 3.6761905 6 7 L 6 8 C 4.9 8 4 8.9 4 10 L 4 20 C 4 21.1 4.9 22 6 22 L 18 22 C 19.1 22 20 21.1 20 20 L 20 10 C 20 8.9 19.1 8 18 8 L 18 7 C 18 3.6761905 15.32381 1 12 1 z M 12 3 C 14.27619 3 16 4.7238095 16 7 L 16 8 L 8 8 L 8 7 C 8 4.7238095 9.7238095 3 12 3 z M 12 13 C 13.1 13 14 13.9 14 15 C 14 16.1 13.1 17 12 17 C 10.9 17 10 16.1 10 15 C 10 13.9 10.9 13 12 13 z"/></svg>
                        <h1>403</h1>
                        <h2>This video is not available.</h2>
                    </div>
                        </div>`;
                        $(".ft-crs-lsn-tabcntnt")
                            .children()
                            .remove(),
                            $(".ft-crs-lsn-tabcntnt").append(restrictedMsg);
                    } else {
                        if ($pObj.video_status == 0) {
                            var restrictedMsg = `<div>
                        <div class="page403">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" viewBox="0 0 24 24" width="100px" height="100px" class="whistle">    <path d="M 12 1 C 8.6761905 1 6 3.6761905 6 7 L 6 8 C 4.9 8 4 8.9 4 10 L 4 20 C 4 21.1 4.9 22 6 22 L 18 22 C 19.1 22 20 21.1 20 20 L 20 10 C 20 8.9 19.1 8 18 8 L 18 7 C 18 3.6761905 15.32381 1 12 1 z M 12 3 C 14.27619 3 16 4.7238095 16 7 L 16 8 L 8 8 L 8 7 C 8 4.7238095 9.7238095 3 12 3 z M 12 13 C 13.1 13 14 13.9 14 15 C 14 16.1 13.1 17 12 17 C 10.9 17 10 16.1 10 15 C 10 13.9 10.9 13 12 13 z"/></svg>
                        <h1>403</h1>
                        <h2>This video is DRM protected.<br/> You cannot view the content in this lesson.</h2>
                    </div>
                        </div>`;
                            $(".ft-crs-lsn-tabcntnt")
                                .children()
                                .remove(),
                                $(".ft-crs-lsn-tabcntnt").append(restrictedMsg);
                        }
                        if ($pObj.video_status == 2) {
                            var currentlink = "";
                            console.log("two", $pObj.support);
                            var pattern = /^\b[A-Z0-9._%-]+[^@]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i;
                            if (
                                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
                                    $pObj.support
                                )
                            ) {
                                // var getLink = $pObj.support;
                                currentlink = `<a style="color: #fff;
                             font-size: 20px;
                             text-decoration: underline;" href="mailto:${getLink}">${getLink}</a>`;
                            } else {
                                currentlink = `<a style="color: #fff;
                            font-size: 20px;
                            text-decoration: underline;" href="${getLink}" target="_blank">${getLink}</a>`;
                            }
                            var restrictedMsg = `<div>
                        <div class="page403">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" viewBox="0 0 24 24" width="100px" height="100px" class="whistle">    <path d="M 12 1 C 8.6761905 1 6 3.6761905 6 7 L 6 8 C 4.9 8 4 8.9 4 10 L 4 20 C 4 21.1 4.9 22 6 22 L 18 22 C 19.1 22 20 21.1 20 20 L 20 10 C 20 8.9 19.1 8 18 8 L 18 7 C 18 3.6761905 15.32381 1 12 1 z M 12 3 C 14.27619 3 16 4.7238095 16 7 L 16 8 L 8 8 L 8 7 C 8 4.7238095 9.7238095 3 12 3 z M 12 13 C 13.1 13 14 13.9 14 15 C 14 16.1 13.1 17 12 17 C 10.9 17 10 16.1 10 15 C 10 13.9 10.9 13 12 13 z"/></svg>
                        <h1>403</h1>
                        <h2 style="text-transform:inherit">This video is not available.<br/> Please contact the vendor at <br/> <span> ${currentlink} </span ></h2>
                    </div>
                        </div>`;
                            $(".ft-crs-lsn-tabcntnt")
                                .children()
                                .remove(),
                                $(".ft-crs-lsn-tabcntnt").append(restrictedMsg);
                        }
                    }
                } else if ($pObj.video_type == "generic_video") {
                    var videoParseData = JSON.parse($pObj.videoData);
                    var videoData = JSON.parse(videoParseData);
                    // console.log(videoData);
                    videoType = "generic_video";
                    if (videoData.customEmbed == 1) {
                        if(videoData.customvideo_type==1){
                            console.log("downloadBtn",downloadBtn);
                            console.log("completeBtn",completeBtn);
                            video =
                            '<div class="row"><div class="embed-responsive embed-responsive-16by9">' +
                            videoData.embed_code +
                            '</div></div><div id="ff-mem-btnsection" class="row mt-3"><div class="col d-flex align-items-center ff-mbrship1-hidemob-showdesk"><h5 class="mb-0"></h5></div><div class="col text-right">'   +
                            downloadBtn +
                            completeBtn +'</div></div>';
                        }else{
                            video =
                            '<div class="row"><div class="embed-responsive">' +
                            videoData.embed_code +
                            '</div></div><div id="ff-mem-btnsection" class="row mt-3"><div class="col d-flex align-items-center ff-mbrship1-hidemob-showdesk"><h5 class="mb-0"></h5></div><div class="col text-right">'   +
                            downloadBtn +
                            completeBtn +'</div></div>';
                        }
                        ($style = `<style type='text/css'">${$pObj.css}</style>`),
                            $(".ft-crs-lsn-tabcntnt")
                                .children()
                                .remove(),
                            $(".ft-crs-lsn-tabcntnt")
                                // .append($style)
                                // .delay(400)
                                .append(video)
                                .delay(400)
                                .append(tempHtml);
                    } else if (videoData.customEmbed == 2) {
                        video =
                            '<video  id="' +
                            lessonVideoId +
                            '" class="video-js vjs-default-skin vjs-layout-medium vjs-big-play-centered mb-3" controls  width="640" height="264"></video><div id="ff-mem-btnsection" class="row"><div class="col d-flex align-items-center ff-mbrship1-hidemob-showdesk"><h5 class="mb-0"></h5></div><div class="col text-right">' +
                            downloadBtn +
                            completeBtn +
                            "</div></div>";
                        ($style = `<style type='text/css'">${$pObj.css}</style>`),
                            $(".ft-crs-lsn-tabcntnt")
                                .children()
                                .remove(),
                            $(".ft-crs-lsn-tabcntnt")
                                // .append($style)
                                // .delay(400)
                                .append(video)
                                .delay(400)
                                .append(tempHtml);
                        // console.log(videoData.video_url);
                        videoUrl = videoData.video_url;
                        var fileExt = videoUrl.split(".").pop();
                        // console.log(fileExt);
                        //   console.log('==================');
                        // videoType = "video/"+fileExt;
                        if (fileExt == "webm") {
                            videoType = "video/webm";
                        } else {
                            videoType = "video/mp4";
                        }

                        var myPlayer = videojs(lessonVideoId, {
                            controls: true,
                            responsive: true,
                            aspectRatio: "16:9",
                            fluid: true,
                            playbackRates: [0.5, 1, 1.5, 2],
                            sources: [
                                {
                                    src: videoUrl,
                                    type: videoType
                                }
                            ],
                            techOrder: ["youtube", "html5"]
                        });
                        myPlayer.one("loadedmetadata", () => {
                            var items = [
                                "top-left",
                                "top",
                                "top-right",
                                "right",
                                "bottom-right",
                                "bottom",
                                "bottom-left",
                                "left",
                                "center-center"
                            ];
                            var duration = myPlayer.duration();
                            var arr = [];
                            var intervel = 10;
                            for (var i = 0; i < duration; i += intervel) {
                                var data = {
                                    start: i,
                                    end: i + 7,
                                    align: random_item(items)
                                };
                                arr.push(data);
                            }
                            myPlayer.overlay({
                                content:
                                    $scope.msName + "<br/ >" + $scope.msEmail,
                                debug: false,
                                align: "bottom-left",
                                showBackground: true,
                                attachToControlBar: false,
                                overlays: arr
                            });
                        });
                        myPlayer.on("playing", function() {
                            $(".vjs-big-play-button").removeClass("ftplayBtn");
                            $(".vjs-big-play-button").addClass("ftpauseBtn");
                        });

                        myPlayer.on("pause", function() {
                            $(".vjs-big-play-button").removeClass("ftpauseBtn");
                            $(".vjs-big-play-button").addClass("ftplayBtn");
                        });

                        myPlayer.ready(function() {
                            $(".vjs-big-play-button").addClass("ftplayBtn");
                            $(document).on("click", ".ftpauseBtn", function() {
                                myPlayer.pause();
                                $(".vjs-big-play-button").removeClass(
                                    "ftpauseBtn"
                                );
                                $(".vjs-big-play-button").addClass("ftplayBtn");
                            });
                            $(document).on("click", ".ftplayBtn", function() {
                                $(".vjs-big-play-button").removeClass(
                                    "ftplayBtn"
                                );
                                $(".vjs-big-play-button").addClass(
                                    "ftpauseBtn"
                                );
                                myPlayer.play();
                            });
                        });
                    }
                }
            } else {
                if ($pObj.show == 1) {
                    var completeBtn = `<button type="submit" class="btn btn-primary ft-mkcomplete" ><i class="far fa-check-circle course_icon ml-auto"></i> Completed</button>`;
                } else {
                    var completeBtn = `<button type="submit" class="btn btn-primary ft-mkcomplete" >Mark as complete</button>`;
                }
                if ($pObj.resourcemode == 1) {
                    var downloadBtn = `<a href="javascript:void(0);" class="btn btn-primary mr-3 ft-download">Download Resources</a>`;
                } else {
                    var downloadBtn = ``;
                }
                // console.log($fbdata);
                // console.log('LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLl');
                var tempHtml = "<div>" + $pObj.html + "</div>";
                video =
                    '<div class="col text-right">' +
                    downloadBtn +
                    completeBtn +
                    "</div>";
                ($style = `<style type='text/css'">${$pObj.css}</style>`),
                    $(".ft-crs-lsn-tabcntnt")
                        .children()
                        .remove(),
                    $(".ft-crs-lsn-tabcntnt")
                        .append(tempHtml)
                        .append(video);
                // .append(fbCode);
            }

            if ($pObj.fbdata != "" && $pObj.fbdata !== null) {
                $fbdata = $scope.parJson($pObj.fbdata);
                // <div class="ela">'+$fbdata.fb_sdkcode+'</div>
                if ($fbdata.status == 1) {
                    // $scope.fb_fbcomments=$fbdata.fb_fbcomments;
                    // $scope.fb_sdkcode=$fbdata.fb_sdkcode;
                    $scope.courseUrl =
                        $pObj.step_url + "?lId=" + $pObj.lesson_id;
                    $(".fb-comments").attr("data-href", $scope.courseUrl);
                    FB.XFBML.parse();
                }
            }
        }
        angular.element(document).ready(function() {
            $(document).on("click", ".ft-logout", function() {
                var jwtToken = {
                    token: localStorage.getItem(FLEXITOKEN),
                    funnel_id: $("meta[name=funnel_id]").attr("content"),
                    funnel_page_id: $("meta[name=funnel_page_id]").attr(
                        "content"
                    ),
                    // machine_id:getMachineId(),
                };
                var data = JSON.stringify(jwtToken);
                var xhr = new XMLHttpRequest();
                xhr.addEventListener("readystatechange", function() {
                    if (this.readyState === 4) {
                        console.log(this.responseText);
                        var data = JSON.parse(this.responseText);
                        console.log(data);
                        localStorage.removeItem(FLEXITOKEN);
                        localStorage.removeItem("loginreload");
                        localStorage.removeItem("flexiUserData");
                        localStorage.clear();
                        window.location.href =
                            data.loginredirect + "?mode=signin";
                    }
                });
                xhr.open("POST", API_BASE_URL + "api/member/logout");
                xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                xhr.setRequestHeader(
                    "authorization",
                    "Bearer " + localStorage.getItem(FLEXITOKEN)
                );
                xhr.setRequestHeader("Content-Type", "application/json");
                xhr.send(data);
                return !1;
            });

            $(document).on("click", ".ft-mkcomplete", function() {
                var data = {
                    lesson_code: $scope.lesson_code,
                    token: localStorage.getItem(FLEXITOKEN)
                };
                $http({
                    url: API_BASE_URL + "api/member/mark-complete",
                    method: "POST",
                    data: data,
                    headers: {
                        Authorization:
                            "Bearer " + localStorage.getItem(FLEXITOKEN)
                    }
                }).then(function(response) {
                    var data = response.data;

                    var courseIndex = $scope.courseIndex;
                    var courseLenth = $scope.courseDetails.length;
                    var dripData = {};
                    if (courseLenth > 0) {
                        var lessonLenth =
                            $scope.courseDetails[courseIndex].lessons.length;
                        if (lessonLenth > 0) {
                            var nextLessionIndex = $scope.lessionIndex + 1;
                            if (nextLessionIndex == lessonLenth) {
                                var nextcourseIndex = courseIndex + 1;
                                courseIndex = nextcourseIndex;
                                $scope.courseSel = nextcourseIndex;
                                dripData =
                                    $scope.courseDetails[nextcourseIndex]
                                        .dripData;
                                courseUpgradeData =
                                    $scope.courseDetails[nextcourseIndex]
                                        .upgrade_data;
                                nextLessionIndex = 0;
                                var nextLession =
                                    $scope.courseDetails[nextcourseIndex]
                                        .lessons[nextLessionIndex];
                            } else {
                                dripData =
                                    $scope.courseDetails[courseIndex].dripData;
                                courseUpgradeData =
                                    $scope.courseDetails[courseIndex]
                                        .upgrade_data;
                                var nextLession =
                                    $scope.courseDetails[courseIndex].lessons[
                                        nextLessionIndex
                                    ];
                            }
                            $scope.getLessonContent(
                                nextLession.lesson_id,
                                nextLession.show,
                                nextLessionIndex,
                                courseIndex,
                                dripData,
                                courseUpgradeData,
                                nextLession.upgrade_data
                            );
                        }
                    }
                });
            });

            $(document).on("click", ".ft-download", function() {
                var data = {
                    lesson_code: $scope.lesson_code,
                    key: $scope.lesson_id,
                    token: localStorage.getItem(FLEXITOKEN)
                };
                $http({
                    url: API_BASE_URL + "api/member/download-content",
                    method: "POST",
                    data: data,
                    headers: {
                        Authorization:
                            "Bearer " + localStorage.getItem(FLEXITOKEN)
                    }
                }).then(function(response) {
                    var data = response.data;
                    if (data.status == true) {
                        if (data.resource_type == 0) {
                        } else if (data.resource_type == 1) {
                            if (data.downloadable_type == "local") {
                                $window.location.href =
                                    "https://api.flexifunnels.com/api/member/resource-download/" +
                                    data.user_id +
                                    "/" +
                                    data.image_name +
                                    "/" +
                                    localStorage.getItem(FLEXITOKEN);
                            } else if (data.downloadable_type == "amazon") {
                            } else if (data.downloadable_type == "dropbox") {
                            }
                        } else if (data.resource_type == 2) {
                            $window.open(data.download_url, "_blank");
                        } else {
                        }
                        // $window.location.href =
                    }
                    // var temp = `<a class="d-none1 ft-link" href="${data.download_url}" download> Download this file </a>`;
                    // $(".ft-link").remove();
                    // $("body").append(temp);
                    // setTimeout(function () {
                    //     $("body").find(".ft-link").trigger("click");
                    // }, 1000);
                });
            });

            $(document).on("click", "a[href*='#submit']", function() {
                let params = new URL(document.location).searchParams;
                //Forgot password
                if (CATEGORY_ID == 71) {
                    var postdata = {
                        funnel_page_id: FUNNEL_PAGE_ID,
                        funnel_id: FUNNEL_ID,
                        email: eValue,
                        baseUrl: document.location.href
                    };
                    // console.log(document.location.href);
                    $(".ffemailinfo")
                        .children()
                        .remove();
                    if ($scope.showMode != 1) {
                        var eValue = $("input[name=email]").val();
                        postdata["email"] = eValue;
                        if (eValue.trim() == "") {
                            $(".ffemailinfo").html(
                                "<p style='color: #D8000C;margin: 0;'>Please enter an valid email</p>"
                            );
                            return;
                        }
                        $http({
                            url: API_BASE_URL + "api/member/forgotten",
                            method: "POST",
                            data: postdata
                            // headers: {
                            //     Authorization:
                            //         "Bearer " + localStorage.getItem(FLEXITOKEN),
                            // },
                        }).then(function(response) {
                            console.log(response);
                            var getresponse = response.data.message;
                            if (response.data.status == "Failure") {
                                $(".ffemailinfo").html(
                                    "<p style='color: #D8000C;margin: 0;'>" +
                                        getresponse +
                                        "</p>"
                                );
                            } else if (response.data.status == "SUCCESS") {
                                $(".ffemailinfo").html(
                                    "<p style='color: #00b626;margin: 0;'>" +
                                        getresponse +
                                        "</p>"
                                );
                            }
                        });
                    } else if ($scope.showMode == 1) {
                        var newpassword = $("input[name=password]").val();
                        var confirmpassword = $(
                            "input[name=confirmpassword]"
                        ).val();
                        $(".ffmbr1-newpassword")
                            .children()
                            .remove();
                        postdata["password"] = $("input[name=password]").val();
                        postdata["confirmpassword"] = $(
                            "input[name=confirmpassword]"
                        ).val();
                        postdata["token"] = params.get("token");
                        postdata["email"] = params.get("email");
                        var responsemessage;

                        if (newpassword !== confirmpassword) {
                            var responsemessage =
                                "New password and confirm password should match";
                            $(".ffmbr1-newpassword").html(
                                "<p style='color: #D8000C;margin: 0;text-align:center;'>" +
                                    responsemessage +
                                    "</p>"
                            );
                        }
                        if (
                            newpassword == "" ||
                            newpassword == null ||
                            confirmpassword == "" ||
                            confirmpassword == null
                        ) {
                            var responsemessage = "Passwords cannot be empty";
                            $(".ffmbr1-newpassword").html(
                                "<p style='color: #D8000C;margin: 0;text-align:center'>" +
                                    responsemessage +
                                    "</p>"
                            );
                        }
                        if (
                            newpassword.length < 6 ||
                            confirmpassword.length < 6
                        ) {
                            var responsemessage =
                                "Passwords must be at least 6 characters";
                            $(".ffmbr1-newpassword").html(
                                "<p style='color: #D8000C;margin: 0;text-align:center'>" +
                                    responsemessage +
                                    "</p>"
                            );
                        } else {
                            $http({
                                url: API_BASE_URL + "api/member/reset",
                                method: "POST",
                                data: postdata
                                // headers: {
                                //     Authorization:
                                //         "Bearer " + localStorage.getItem(FLEXITOKEN),
                                // },
                            }).then(function(response) {
                                var getresponse = response.data.message;
                                if (response.data.status == "ERROR") {
                                    $(".ffmbr1-newpassword").html(
                                        "<p style='color: #D8000C;margin: 0;text-align:center'>" +
                                            getresponse +
                                            "</p>"
                                    );
                                } else if (response.data.status == "SUCCESS") {
                                    $(".ffmbr1-newpassword").html(
                                        "<p style='color: #00b626;margin: 0;text-align:center;'>" +
                                            getresponse +
                                            "You will be redirected to login page automatically." +
                                            "</p>"
                                    );
                                    setTimeout(function() {
                                        window.location.href = $scope.url["16"];
                                    }, 6000);
                                }
                            });
                        }
                    }
                } else if (CATEGORY_ID == 16) {
                    var formId = $(this).attr("data-formid");

                    $dataObject = {};
                    $dataObject["funnel_id"] = $("meta[name=funnel_id]").attr(
                        "content"
                    );
                    $dataObject["funnel_page_id"] = $(
                        "meta[name=funnel_page_id]"
                    ).attr("content");

                    $formData = $("#" + formId).serializeArray();
                    $formData.map(function(val) {
                        var key = val.name;
                        $dataObject[key] = val.value;
                    });
                    // $dataObject["machine_id"]=getMachineId();
                    var data = JSON.stringify($dataObject);
                    console.log(data);

                    var xhr = new XMLHttpRequest();
                    xhr.addEventListener("readystatechange", function() {
                        if (this.readyState === 4) {
                            var data = JSON.parse(this.responseText);
                            console.log(data);
                            try {
                                var decoded = jwt_decode(data.token);
                                console.log(decoded);
                            } catch (error) {}
                            if (data.success === true) {
                                localStorage.setItem(FLEXITOKEN, data.token);
                                localStorage.setItem(
                                    "flexiUserData" + FUNNEL_ID,
                                    JSON.stringify(decoded)
                                );
                                window.location.href = data.redirect;
                            } else {
                                if (data.message !== null) {
                                    $(".ft-error").html(
                                        "<span style='color:#D8000C;text-align:center;display:block;'>" +
                                            data.message +
                                            "</span>"
                                    );
                                } else {
                                    $(".ft-error").html(
                                        "<span style='color:#D8000C;text-align:center;display:block;'>" +
                                            "Please provide credentials to login" +
                                            "</span>"
                                    );
                                }
                            }
                        }
                    });

                    xhr.open(
                        "POST",
                        "https://api.flexifunnels.com/api/member/login"
                    );
                    // xhr.open("POST", "http://localhost:3014/api/member/login");
                    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                    xhr.setRequestHeader("Content-Type", "application/json");
                    xhr.send(data);
                }

                return false;
            });
            //Mobile hamburger toggle
            $(document).on("click", "#ffhamone", function(e) {
                e.stopPropagation();
                $("#ffhamone_div").toggle("slow");
            });

            $(document).on("click", function() {
                if (screen.width <= 1024) {
                    $("#ffhamone_div").hide("slow");
                }
            });
        });

        //Doc Ready End.........
        $scope.getLessonContent = function(
            lesson_id,
            Show,
            lessionIndex,
            courseIndex,
            dripData,
            courseUpgradeData,
            lessonUpgradeData
        ) {
            ranId = makeid(4);
            $scope.lessionSel = lesson_id;
            $scope.lessionIndex = lessionIndex;
            $scope.courseIndex = courseIndex;
            if (dripData.show == 0) {
                var disCount = 0;
                var disText = "";
                if (dripData.days == 0) {
                    if (dripData.hours == 0) {
                        if (dripData.minutes == 0) {
                            if (dripData.seconds == 0) {
                            } else {
                                disCount = dripData.seconds;
                                disText = "second(s)";
                            }
                        } else {
                            disCount = dripData.minutes;
                            disText = "minute(s)";
                        }
                    } else {
                        disCount = dripData.hours;
                        disText = "hour(s)";
                    }
                } else {
                    disCount = dripData.days;
                    disText = "day(s)";
                }
                var restrictedMsg = `<div>
                <div class="page403">
                <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" viewBox="0 0 24 24" width="100px" height="100px" class="whistle">    <path d="M 12 1 C 8.6761905 1 6 3.6761905 6 7 L 6 8 C 4.9 8 4 8.9 4 10 L 4 20 C 4 21.1 4.9 22 6 22 L 18 22 C 19.1 22 20 21.1 20 20 L 20 10 C 20 8.9 19.1 8 18 8 L 18 7 C 18 3.6761905 15.32381 1 12 1 z M 12 3 C 14.27619 3 16 4.7238095 16 7 L 16 8 L 8 8 L 8 7 C 8 4.7238095 9.7238095 3 12 3 z M 12 13 C 13.1 13 14 13.9 14 15 C 14 16.1 13.1 17 12 17 C 10.9 17 10 16.1 10 15 C 10 13.9 10.9 13 12 13 z"/></svg>
                <h1>403</h1>
                <h2>This module will unlock in ${disCount} ${disText}</h2>
              </div>
                </div>`;
                $(".ft-crs-lsn-tabcntnt")
                    .children()
                    .remove(),
                    $(".ft-crs-lsn-tabcntnt").append(restrictedMsg);
                return false;
            }
            if (Show == 1) {
                var data = {
                    token: localStorage.getItem(FLEXITOKEN),
                    lesson_id: lesson_id,
                    funnel_id: $("meta[name=funnel_id]").attr("content"),
                    funnel_page_id: $("meta[name=funnel_page_id]").attr(
                        "content"
                    ),
                    // machine_id:getMachineId(),
                };
                dataService.getData(
                    API_BASE_URL + "api/member/getlessons?v="+ranId,
                    data,
                    function(response) {
                        if (
                            response.data.status == false &&
                            response.data.mode != undefined
                        ) {
                            if (response.data.mode == "logoutMode") {
                                localStorage.removeItem(FLEXITOKEN);
                                localStorage.removeItem("flexiUserData");
                                localStorage.clear();
                                window.location.href =
                                    response.data.loginredirect +
                                    "?mode=signin";
                            }
                        } else {
                            var data = response.data;
                            $scope.lesson_id = data.lesson_id;
                            $scope.lesson_code = data.lesson_code;
                            appendContent(data);
                            if (screen.width <= 1024) {
                                $("#ffhamone_div").hide("slow");
                            }
                        }
                    }
                );

                // $http({
                //     url: API_BASE_URL + "api/member/getlessons",
                //     method: "POST",
                //     data: data,
                //     headers: {
                //         Authorization:
                //             "Bearer " + localStorage.getItem(FLEXITOKEN),
                //     },
                // }).then(function (response) {
                //     var data = response.data;
                //     $scope.lesson_id = data.lesson_id;
                //     $scope.lesson_code = data.lesson_code;
                //     // console.log(data);
                //     appendContent(data);
                // });
            } else {
                var emptyTxt =
                    '<svg xmlns="http://www.w3.org/2000/svg" fill="#000000" viewBox="0 0 24 24" width="100px" height="100px" class="whistle">    <path d="M 12 1 C 8.6761905 1 6 3.6761905 6 7 L 6 8 C 4.9 8 4 8.9 4 10 L 4 20 C 4 21.1 4.9 22 6 22 L 18 22 C 19.1 22 20 21.1 20 20 L 20 10 C 20 8.9 19.1 8 18 8 L 18 7 C 18 3.6761905 15.32381 1 12 1 z M 12 3 C 14.27619 3 16 4.7238095 16 7 L 16 8 L 8 8 L 8 7 C 8 4.7238095 9.7238095 3 12 3 z M 12 13 C 13.1 13 14 13.9 14 15 C 14 16.1 13.1 17 12 17 C 10.9 17 10 16.1 10 15 C 10 13.9 10.9 13 12 13 z"/></svg> <h1>403</h1>';
                var upgradeLink = "";
                var upgradeBtnTxt = "";
                var upgradeMsg = "Access forbidden!";
                if (lessonUpgradeData !== null) {
                    upgradeData = JSON.parse(lessonUpgradeData);
                    upgradeLink = upgradeData.link;
                    upgradeBtnTxt = upgradeData.buttontext;
                    upgradeMsg = upgradeData.message;
                    emptyTxt = "";
                } else {
                    if (courseUpgradeData !== null) {
                        upgradeData = JSON.parse(courseUpgradeData);
                        upgradeLink = upgradeData.link;
                        upgradeBtnTxt = upgradeData.buttontext;
                        upgradeMsg = upgradeData.message;
                        emptyTxt = "";
                    }
                    // var upgradeLink="";
                    // var upgradeBtnTxt="";
                    // var upgradeMsg="Access forbidden!";
                }
                var restrictedMsg = `<div>
                <div class="page403">
                ${emptyTxt}
                <h3>${upgradeMsg}</h2>
                <a class="btn btn-success btn-lg btnupgrade" href="${upgradeLink}" target="_blank">${upgradeBtnTxt}</a>
              </div>
                </div>`;
                $(".ft-crs-lsn-tabcntnt")
                    .children()
                    .remove(),
                    $(".ft-crs-lsn-tabcntnt").append(restrictedMsg);
                if (upgradeLink == "" && upgradeBtnTxt == "") {
                    $(".btnupgrade").addClass("d-none");
                } else {
                    $(".btnupgrade").removeClass("d-none");
                }
            }
        };

        $scope.courseDetails = [];
        postdata = {
            funnel_page_id: FUNNEL_PAGE_ID,
            funnel_id: FUNNEL_ID,
            token: localStorage.getItem(FLEXITOKEN),
            // machine_id:getMachineId(),
        };
        if (CATEGORY_ID == 38) {
            dataService.getData(
                API_BASE_URL + "api/member/getcourse-details",
                postdata,
                function(response) {
                    console.log(response);
                    if (response.data) {
                        if (
                            response.data.status == false &&
                            response.data.mode != undefined
                        ) {
                            if (response.data.mode == "logoutMode") {
                                localStorage.removeItem(FLEXITOKEN);
                                localStorage.removeItem("flexiUserData");
                                localStorage.clear();
                                window.location.href =
                                    response.data.loginredirect +
                                    "?mode=signin";
                            }
                        } else {
                            $scope.courseDetails = response.data.courses;
                            $scope.customerName = response.data.member.name;
                            $scope.customerEmail = response.data.member.email;
                        }
                    }
                }
            );
        } else if (CATEGORY_ID == 17) {
            ranId = makeid(4);
            $scope.msName = "";
            $scope.msEmail = "";
            dataService.getData(
                API_BASE_URL + "api/member/getcourse?v="+ranId,
                postdata,
                function(response) {
                    if (response.data) {
                        if (
                            response.data.status == false &&
                            response.data.mode != undefined
                        ) {
                            if (response.data.mode == "logoutMode") {
                                localStorage.removeItem(FLEXITOKEN);
                                localStorage.removeItem("flexiUserData");
                                localStorage.clear();
                                window.location.href =
                                    response.data.loginredirect +
                                    "?mode=signin";
                            }
                        } else {
                            $scope.courseDetails = response.data.courses;
                            $scope.courseTitle = response.data.title;
                            if (
                                document.title != $scope.courseTitle.course_name
                            ) {
                                document.title = $scope.courseTitle.course_name;
                            }
                            if (
                                $scope.courseTitle.release_date_mode == 1 &&
                                $scope.courseTitle.release_date_show == false
                            ) {
                                $scope.courseTitle.restrictCourse = false;
                                $scope.disCount = 0;
                                $scope.disText = "";

                                if ($scope.courseTitle.days == 0) {
                                    // console.log("one", $scope.courseTitle);
                                    if ($scope.courseTitle.hours == 0) {
                                        if ($scope.courseTitle.minutes == 0) {
                                            if (
                                                $scope.courseTitle.seconds == 0
                                            ) {
                                            } else {
                                                $scope.disCount =
                                                    $scope.courseTitle.seconds;
                                                $scope.disText = "second(s)";
                                            }
                                        } else {
                                            $scope.disCount =
                                                $scope.courseTitle.minutes;
                                            $scope.disText = "minute(s)";
                                        }
                                    } else {
                                        $scope.disCount =
                                            $scope.courseTitle.hours;
                                        $scope.disText = "hour(s)";
                                    }
                                } else {
                                    $scope.disCount = $scope.courseTitle.days;
                                    $scope.disText = "day(s)";
                                }
                            }

                            if ($scope.courseTitle.restrict_day_mode == 1) {
                                if ($scope.courseTitle.release_content != "") {
                                    $scope.customdetails = $scope.parJson(
                                        $scope.courseTitle.release_content
                                    );
                                    $scope.upgradeTxt =
                                        $scope.customdetails.upgradetext;
                                    $scope.upgradebuttonTxt =
                                        $scope.customdetails.buttontext;
                                    $scope.upgradebuttonLink =
                                        $scope.customdetails.buttonlink;
                                }
                            }

                            if (
                                $scope.courseTitle.fbdata != "" &&
                                $scope.courseTitle.fbdata !== null
                            ) {
                                $scope.fbdata = $scope.parJson(
                                    $scope.courseTitle.fbdata
                                );
                                if ($scope.fbdata.status == 1) {
                                    $scope.fb_sdkcode = `<div id="fb-root"></div>
                                    <script async defer crossorigin="anonymous" src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v16.0&appId=260202827723089&autoLogAppEvents=1" nonce="Jksoe2OR"></script>
                                    `;
                                    // var fb_sdkcode=$scope.fbdata.fb_sdkcode;
                                    // $("#fbCmd").append(fb_sdkcode);
                                }
                            }

                            $scope.dashboard_url = response.data.dashboard_url;
                            if (typeof response.data.name != "undefined") {
                                $scope.msName = response.data.name;
                            }
                            $scope.msEmail = response.data.email;
                            setTimeout(function() {
                                var fobj = $(".lesson_name").first();
                                angular.element(fobj).trigger("click");
                            }, 100);
                        }
                    }
                }
            );
        } else if (CATEGORY_ID == 40) {
            $scope.credential = null;
            $scope.existUser = null;
            let params = new URL(document.location).searchParams;

            var user_type = params.get("thayipha");
            if (user_type == 2) {
                $scope.existUser =
                    "Your course access has been updated. Please check your email for the credentials. If you have already logged in, please use the same credentials to log in again.";
            } else {
                postdata = {
                    password: params.get("iphasiwedi").replaceAll(" ", "+"),
                    user_id: params.get("umsebenzisi"),
                    url: params.get("indlela"),
                    token: localStorage.getItem(FLEXITOKEN)
                };

                dataService.getData(
                    API_BASE_URL + "api/member/get-access",
                    postdata,
                    function(response) {
                        $scope.credential = response.data;
                        console.log(response);
                    }
                );
            }
        } else if (CATEGORY_ID == 16 || CATEGORY_ID == 71) {
            $scope.showMode = "";
            let params = new URL(document.location).searchParams;
            $scope.showMode = params.get("forget");
            $scope.url = null;
           
            //onload condition
            postdata["type"] = "forget";
            $http({
                url: API_BASE_URL + "api/member/get-default",
                method: "POST",
                data: postdata
            }).then(function(response) {
                // console.log(response);
                $scope.url = response.data.url;
                if(postdata.token !==null){
                    window.location.href = $scope.url["38"];
                }
            });
        }
        console.log(CATEGORY_ID);

        $scope.getmyPlans = function() {
            var data = {
                funnel_page_id: FUNNEL_PAGE_ID,
                funnel_id: FUNNEL_ID,
                token: localStorage.getItem(FLEXITOKEN)
            };
            $http({
                url: API_BASE_URL + "api/member/get-myplans",
                method: "POST",
                data: data
            }).then(function(response) {
                $scope.myPlans = response.data.my_plan;
            });
        };

        $scope.downloadInvoice = function(
            product_title,
            membership_product_id
        ) {
            var data = {
                funnel_page_id: FUNNEL_PAGE_ID,
                funnel_id: FUNNEL_ID,
                token: localStorage.getItem(FLEXITOKEN),
                product_title: product_title,
                membership_product_id: membership_product_id
            };
            $http({
                url: API_BASE_URL + "api/member-data/generate-invoice",
                method: "POST",
                data: data
            }).then(function(response) {
                if (response.data.status == true) {
                    $window.location.href =
                        API_BASE_URL +
                        "api/member-data/download-invoice/" +
                        response.data.filename +
                        "/" +
                        localStorage.getItem(FLEXITOKEN);
                    // $http({
                    //     url: API_BASE_URL + "api/member-data/download-invoice/"+response.data.filename,
                    //     method: "GET",
                    //     data: data
                    // }).then(function(response) {

                    // });
                } else {
                    alert("Something went wrong");
                }
            });
        };
    }
]);

app.directive("parentDirective", [
    "$sce",
    function($sce) {
        return {
            template: templateLayout
            // templateUrl: $sce.trustAsResourceUrl(
            //     "https://app.flexifunnels.com/layout/membership/theme/1/ms_area.html"
            // ),
            // templateUrl: $sce.trustAsResourceUrl(
            //     "//app.flexifunnels.com/layout/membership/theme/1/ms_area.html"
            // ),
        };
    }
]);
