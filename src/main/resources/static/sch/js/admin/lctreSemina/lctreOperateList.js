let vueData = {
    totalCount: 0,
    lctreOperateList: [],
    searchData: {
        canceledLctreInclude: false,
        authorOne: "",
        searchText: '',
        pageNo: 1,
        pageLength: 10
    },
    userAuthor: "", //로그인한 사용자의 권한
    userName: "",   //로그인한 사용자의 이름
    userEmail: "",  //로그인한 사용자의 이메일
    userSeq: "",    //로그인한 사용자의 일련번호
    accessToken: "",
};

let dataPerPage = 10;
let pagePerBar = 10;
let pageCount = 10;
let vm;
let token;

let vueInit = () => {
    const app = Vue.createApp({
        data() {
            return vueData;
        },
        methods: {
            fnSearch: function (userAuthor) {
                this.searchData.pageNo = 1;
                if (userAuthor !== '') {
                    vm.searchData.authorOne = userAuthor;
                }
                event.getLctreOperateList();
            },
            fnDetail: event.fnDetail,
            ellipsisText: (text, len, lastTxt) => {
                return util.formmater.textLengthOverCut(text, len, lastTxt);
            },
            startLctreFn: (lctreSeq, lctreSn) => {
                event.startLctreFn(lctreSeq, lctreSn);
            },
            fnParticipantDetail: (lctreSeq, lctreSn) => {
            },
        },
    });
    vm = app.mount("#content");
};

let event = {
    getLctreOperateList: () => {
        $.sendAjax({
            url: "/lctreController/selectLctreOperateList.api",
            data: vm.searchData,
            contentType: "application/json",
            success: (res) => {
                vm.totalCount = res.data.totalCount;
                vm.lctreOperateList = res.data.list;
                let len = vm.lctreOperateList.length;

                //회원종류 글자로 변환
                for (let i = 0; i < len; i++) {
                    let atnlcAuthorArrayStr = vm.lctreOperateList[i].atnlcAuthorArray;
                    atnlcAuthorArrayStr = atnlcAuthorArrayStr.replace("ALL", "전체")
                        .replace("ETA", "기타-중고생")
                        .replace("ETB", "기타-초등생")
                        .replace("ETC", "기타-지역주민")
                        .replace("FF", "교직원")
                        .replace("ST", "순천향대학생")
                        .replace("TJ", "텐진외대학생")
                        .replaceAll(", ", "/");
                    vm.lctreOperateList[i].atnlcAuthorArray = atnlcAuthorArrayStr;
                }

                //강의일 포맷 맞춤
                for (let i = 0; i < len; i++) {
                    let lctreDtStr = vm.lctreOperateList[i].lctreDt;
                    lctreDtStr = util.date.addDateDash(lctreDtStr);
                    vm.lctreOperateList[i].lctreDt = lctreDtStr;
                }

                fnPaging(res.data.totalCount, dataPerPage, pageCount, res.data.pageNo, (selectPage) => {
                    vm.searchData.pageNo = selectPage;
                    event.getLctreOperateList();
                });
            }
            , error: function (e) {
                $.alert(e.responseJSON.message);
            }
        });
    },
    getUser: () => {
        $.sendAjax({
            url: "/lctreController/selectUser.api",
            data: vm.searchData,
            contentType: "application/json",
            success: (res) => {
                vm.userAuthor = res.data.userAuthor;
                vm.userName = res.data.userNm;
                vm.userEmail = res.data.userEmail;
                vm.userSeq = res.data.userSeq;
            },
            error: function (e) {
                $.alert(e.responseJSON.message);
            },
        });
    },
    fnDetail: (lctreSeq, lctreSn, target) => {
        if (target === 'register') {
            location.href = "lctreOperateDetail.html?lctreSeq=" + lctreSeq + "&lctreSn=" + lctreSn + "&target=" + target;
        } else {
            location.href = "lctreOperateDetail.html?lctreSeq=" + lctreSeq + "&lctreSn=" + lctreSn;
        }

    },
    startLctreFn: async (lctreSeq, lctreSn) => {
        let paramMap =
            {
                "onAirAt": "Y",
                "lctreSeq": lctreSeq,
                "lctreSn": lctreSn
            };
        await $.sendAjax({
            url: "/lctreController/updateLctreFx.api",
            data: paramMap,
            contentType: "application/json",
            success: async (res) => {
				event.updateOnAirLctre(lctreSeq, lctreSn)
                await event.gitSiMeetSetting(lctreSeq, lctreSn);
                $("#meet").css({
                    "display": "block",
                    "position": "absolute",
                    "z-index": "1200",
                    "top": "0",
                    "left": "0",
                    "width": "100%",
                    "height": "100%"
                });
                $("#meet").show();
            },
            error: function (e) {
                $.alert(e.responseJSON.message);
            },
        });
    },
	gitSiMeetSetting: async (lctreSeq, lctreSn) => {
		$.sendAjax({
			url: "/cmmn/jwtForJitsi.api",
			data:{
                context: {
                    user: {
                        id: vm.userSeq,
                        name: vm.userName,
                        email: vm.userEmail,
                        avatar: "",
                        affiliation: "owner"
                    },
                    group: ""
                },
                aud: "jitsimeetid",
                iss: "jitsimeetid",
                sub: "*",
                room: "*"
			},
			contentType: "application/json",
			error: function (e) {
				$.alert(e.responseJSON.message);
			},
		}).then((res) => {
			vm.token = res.data.token;
			const TOKEN = vm.token;
			const domain = JITSI_URL;
			const roomName = "lctre-" + lctreSeq + "-" + lctreSn;
			const now = new Date().toLocaleString("ko-KR", {timeZone: "Asia/Seoul"});
			const koreanDate = new Date(now);
			const timestamp = `${koreanDate.getFullYear()}${String(koreanDate.getMonth() + 1).padStart(2, "0")}${String(koreanDate.getDate()).padStart(2, "0")}${String(koreanDate.getHours()).padStart(
				2,
				"0"
			)}${String(koreanDate.getMinutes()).padStart(2, "0")}`;

			const encodedRoomName = encodeURIComponent(roomName);
			const fileName = `${encodedRoomName}_${timestamp}.webm`;
			const options = {
				jwt: TOKEN,
				roomName: roomName,
				height: "100%",
				width: "100%",
				configOverwrite: {
					defaultLanguage: "ko",
					startWithAudioMuted: false,
					startWithVideoMuted: false,
					disableProfile: false,
					prejoinPageEnabled: false,
					disableInviteFunctions: true
					//  maxParticipants: 5
				},
				interfaceConfigOverwrite: {
					PIP_ENABLED: true
				},

				parentNode: document.querySelector("#meet")
			};
			const api = new window.JitsiMeetExternalAPI(domain, options);
			window.onbeforeunload = function(event) {
				$.sendAjax({
					url: "/lctreController/updateLctreFx.api",
					data: {"onAirAt": "N","lctreSeq": lctreSeq,"lctreSn": lctreSn},
					contentType: "application/json",
					success: (res) => {
					},
					error: function (e) {
					},
				});
			}

			api.addEventListener("readyToClose", (e) => {
				api.dispose();
				let paramMap =
					{
						"onAirAt": "N",
						"lctreSeq": lctreSeq,
						"lctreSn": lctreSn
					};
				$.sendAjax({
					url: "/lctreController/updateLctreFx.api",
					data: paramMap,
					contentType: "application/json",
					success: (res) => {
						$("#meet").hide();
					},
					error: function (e) {
						$.alert(e.responseJSON.message);
					},
				});
			});

			// 교수는 video 조인하자마자 녹화시작하기기능
			api.addEventListener('videoConferenceJoined', () => { 
				api.executeCommand('startRecording', {
					mode: 'local',  
					localRecording: { enabled: true }
				});     
			});
        });
    },

	updateOnAirLctre: async (lctreSeq, lctreSn) => {
		// nodejs 통해서 onAir 시그널 보내기
		$.sendAjax({
			url: NODE_URL + "/node/onAirLecture",
			data: {
				code: "lctre-" + lctreSeq + "-" + lctreSn
			},
			contentType: "application/json",
			success: (res) => {
			},
			error: function (e) {
			},
		})
	}
}

$(document).ready(() => {
    vueInit();
    util.tableSetting();
    event.getUser();
    event.getLctreOperateList();
});
