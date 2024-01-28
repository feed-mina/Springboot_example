let vueData = {
    totalCount: 0,
    seminaOperateList: [],
    searchData: {
        canceledSeminaInclude: false,
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
                event.getSeminaOperateList();
            },
            fnDetail: event.fnDetail,
            ellipsisText: (text) => {
                return util.formmater.textLengthOverCut(text, null, null);
            },
            startSeminaFn: (seminaSeq) => {
                event.startSeminaFn(seminaSeq);
            },
            fnParticipantDetail: (seminaSeq) => {
            },
        },
    });
    vm = app.mount("#content");
}

let event = {
    getSeminaOperateList: () => {
        $.sendAjax({
            url: "/seminaController/selectSeminaOperateList.api",
            data: vm.searchData,
            contentType: "application/json",
            success: (res) => {
                vm.totalCount = res.data.totalCount;
                vm.seminaOperateList = res.data.list;
                let len = vm.seminaOperateList.length;

                for (let i = 0; i < len; i++) {
                    //회원종류 글자로 변환
                    let atnlcAuthorArrayStr = vm.seminaOperateList[i].atnlcAuthorArray;
                    atnlcAuthorArrayStr = atnlcAuthorArrayStr.replace("ALL", "전체")
                        .replace("ETA", "기타-중고생")
                        .replace("ETB", "기타-초등생")
                        .replace("ETC", "기타-지역주민")
                        .replace("FF", "교직원")
                        .replace("ST", "순천향대학생")
                        .replace("TJ", "텐진외대학생")
                        .replaceAll(", ", "/");
                    vm.seminaOperateList[i].atnlcAuthorArray = atnlcAuthorArrayStr;

                    //세미나 날짜 form 맞춰주기
                    vm.seminaOperateList[i].seminaDe = util.date.addDateDash(vm.seminaOperateList[i].seminaDe);
                }

                fnPaging(res.data.totalCount, dataPerPage, pageCount, res.data.pageNo, (selectPage) => {
                    vm.searchData.pageNo = selectPage;
                    event.getSeminaOperateList();
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
    fnDetail: (seminaSeq, target) => {
        if (target === 'register') {
            location.href = "seminaOperateDetail.html?seminaSeq=" + seminaSeq + "&target=" + target;
        } else {
            location.href = "seminaOperateDetail.html?seminaSeq=" + seminaSeq;
        }
    },
    startSeminaFn: async (seminaSeq) => {
        let paramMap =
            {
                "onAirAt": "Y",
                "seminaSeq": seminaSeq
            };
        await $.sendAjax({
            url: "/seminaController/updateSeminaForConfirm.api",
            data: paramMap,
            contentType: "application/json",
            success: async (res) => {
				event.updateOnAirSemina(seminaSeq);
                await event.gitSiMeetSetting(seminaSeq);
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
    gitSiMeetSetting: async (seminaSeq) => {
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
			const roomName = "semina-" + seminaSeq;
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
					url: "/seminaController/updateSeminaForConfirm.api",
					data: { "onAirAt": "N", "seminaSeq": seminaSeq },
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
						"seminaSeq": seminaSeq
					};
				$.sendAjax({
					url: "/seminaController/updateSeminaForConfirm.api",
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

	updateOnAirSemina: async (seminaSeq) => {
		// nodejs 통해서 onAir 시그널 보내기
		$.sendAjax({
			url: NODE_URL + "/node/onAirSemina",
			data: {
				code: "semina-" + seminaSeq
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
    event.getSeminaOperateList();
});
