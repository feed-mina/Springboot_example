let vueData = {
    seminaData: {
        seminaSeq: "",              //세미나일련
        seminaNm: "",               //세미나명
        seminaKndCode: "",          //세미나종류코드
        seminaKndCodeNm: "",        //세미나종류코드이름
        useLangCd: "",             //사용언어
        useLangCdNm: "",           //사용언어이름
        progrsUserSeq: "",          //진행이용자일련
        progrsUserNm: "",           //진행이용자이름
        progrsUserEmail: "",        //진행이용자이메일
        smtmIntrprSeq: "",          //동시통역일련
        smtmIntrprNm: "",           //동시통역이름
        smtmIntrprEmail: "",        //동시통역이메일
        lctrUserSeqArray: [],       //강연이용자일련배열
        seminaStyleSe: "",          //세미나스타일구분
        seminaDe: "",               //세미나일자

        startHour: "",				//세미나 시작 시간
        startMinute: "",			//세미나 시작 분
        endHour: "",				//세미나 종료 시간
        endMinute: "",				//세미나 종료 분

        seminaPlaceNm: "",          //세미나장소명
        startPeriodDt: "",			//모집기간 시작일자
        endPeriodDt: "",			//모집기간 종료일자
        startPeriodHour: "",		//모집기간 시작시간
        startPeriodMinute: "",		//모집기간 시작분
        endPeriodHour: "",			//모집기간 종료시간
        endPeriodMinute: "",		//모집기간 종료분

        atnlcAuthorArray: "",       //수강권한배열 -> 회원 종류
        userKndCodeArrayStr: "",
        atnlcCo: "",                //수강수
        seminaImageCn: "",          //세미나 현수막 이미지
        seminaDc: "",               //세미나설명
        seminaCn: "",               //세미나내용
        seminaSttusSe: "",          //세미나상태구분 (R:미정,C:확정,D:취소)
        seminaKeywordArray: [],		//검색 키워드
        seminaParticipantCnt: "",   //세미나 참여자 수
        seminaUserCnt: "",          //세미나 신청자 수
        seminaParticipantUserArray: [], //세미나 참여자 배열
        seminaApplyUserArray: [],       //세미나 신청자 배열
    },
    authorList: [],					//commonCode에서 받아온 회원 종류 리스트
    userList: [],
}

let vm;

let vueInit = () => {
    const app = Vue.createApp({
        data() {
            return vueData;
        },
        methods: {
            selectCmmnCode: () => {
                let paramList = [
                    {upperCmmnCode: "AUTHOR", cmmnCodeEtc: "LCTRE_USER"},
                ];

                for (let i = 0; i < paramList.length; i++) {
                    $.sendAjax({
                        url: "/cmmn/selectCmmnCode.api",
                        data: paramList[i],
                        contentType: "application/json",
                        success: (res) => {
                            switch (paramList[i].upperCmmnCode) {
                                case 'AUTHOR':
                                    vm.authorList = res.data;
                                    break;
                            }
                        },
                        error: function (e) {
                            $.alert(e.responseJSON.message);
                        },
                    });
                }
            },
        },
    });
    vm = app.mount('#content');
}

let event = {
    init: () => {
        $(document).on("click", "#btnList", function (e) {
            location.href = "seminaList.html";
        });
        $(document).on("click", "#btnUpdate", function (e) {
            let urlParams = new URL(location.href).searchParams;
            let seminaSeq = urlParams.get('seminaSeq');
            location.href = "seminaUpdt.html?seminaSeq=" + seminaSeq;
        });
        $(document).on("click", "#btnCancelSemina", function (e) {
            let urlParams = new URL(location.href).searchParams;
            let seminaSeq = urlParams.get('seminaSeq');
            location.href = "seminaCancel.html?seminaSeq=" + seminaSeq;
        });
        $(document).on("click", "#btnFileDownloadForRegister", function (e) {
            let seminaApplyUserArray = vm.seminaData.seminaApplyUserArray;
            let paramMap =
                {
                    'seminaApplyUserArray':
                    seminaApplyUserArray
                };
            $.sendAjax({
                url: "/seminaController/getCurrentUserListExcel.api",
                data: paramMap,
                contentType: "application/json",
                xhrFields: {
                    'responseType': 'blob'
                },
                success: (res, status, xhr) => {
                    let filename = '현재 세미나 신청자 현황.xlsx';
                    let filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                    let disposition = xhr.getResponseHeader('Content-Disposition');
                    let matches = filenameRegex.exec(disposition);
                    if (matches != null && matches[1]) {
                        filename = matches[1].replace(/['"]/g, '');
                    }

                    let link = document.createElement('a');
                    link.href = URL.createObjectURL(res);
                    link.download = decodeURI(filename);
                    link.click();
                },
                error: function (e) {
                    $.alert(e.responseJSON.message);
                },
            });
        });
        $(document).on("click", "#btnFileDownloadForParticipants", function (e) {
            let seminaParticipantUserArray = vm.seminaData.seminaParticipantUserArray;
            let paramMap =
                {
                    'seminaParticipantUserArray':
                    seminaParticipantUserArray
                };
            $.sendAjax({
                url: "/seminaController/getCurrentParticipantsListExcel.api",
                data: paramMap,
                contentType: "application/json",
                xhrFields: {
                    'responseType': 'blob'
                },
                success: (res, status, xhr) => {
                    let filename = '현재 세미나 참여자 현황.xlsx';
                    let filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                    let disposition = xhr.getResponseHeader('Content-Disposition');
                    let matches = filenameRegex.exec(disposition);
                    if (matches != null && matches[1]) {
                        filename = matches[1].replace(/['"]/g, '');
                    }

                    let link = document.createElement('a');
                    link.href = URL.createObjectURL(res);
                    link.download = decodeURI(filename);
                    link.click();
                },
                error: function (e) {
                    $.alert(e.responseJSON.message);
                },
            });
        });
        $(document).on("click", "#seminaParticipantsNum", function (e) {
            $("#seminaParticipantsContent").removeClass("visibil");
        });
        $(document).on("click", "#btnStartSemina", function (e) {
            let urlParams = new URL(location.href).searchParams;
            let seminaSeq = urlParams.get('seminaSeq');
            event.startSeminaFn(seminaSeq);
        });
    },
    getSeminaDetail: () => {
        let urlParams = new URL(location.href).searchParams;
        let seminaSeq = urlParams.get('seminaSeq');
        let target = urlParams.get('target');
        let paramMap = {'seminaSeq': seminaSeq};
        $.sendAjax({
            url: "/seminaController/selectSemina.api",
            data: paramMap,
            contentType: "application/json",
            success: async (res) => {
                let resData = res.data;
                await event.setSemina(resData);
                $.sendAjax({
                    url: "/seminaController/selectSeminaApplyList.api",
                    data: paramMap,
                    contentType: "application/json",
                    success: async (selectSeminaApplyListRes) => {
                        await event.setSeminaApply(selectSeminaApplyListRes.data);
                    },
                    error: function (e) {
                        $.alert(e.responseJSON.message);
                    },
                });
                $.sendAjax({
                    url: "/seminaController/selectSeminaParticipantsList.api",
                    data: paramMap,
                    contentType: "application/json",
                    success: async (seminaParticipantsListRes) => {
                        await event.setSeminaParticipants(seminaParticipantsListRes.data);
                        if (target === 'register') {
                            let bottomPosition = $("#container").prop("clientHeight");
                            $(window).scrollTop(bottomPosition);
                        }
                    },
                    error: function (e) {
                        $.alert(e.responseJSON.message);
                    },
                });
            },
            error: function (e) {
                $.alert(e.responseJSON.message);
            },
        });
    },
    setSemina: (resData) => {
        vm.seminaData.seminaSeq = resData.seminaSeq;                        //세미나일련
        vm.seminaData.seminaNm = resData.seminaNm;                          //세미나명
        vm.seminaData.seminaKndCode = resData.seminaKndCode;                //세미나종류코드
        vm.seminaData.seminaKndCodeNm = resData.seminaKndCodeNm;            //세미나종류코드이름
        vm.seminaData.useLangCd = resData.useLangCd;                        //세미나사용언어
        vm.seminaData.useLangCdNm = resData.useLangCdNm;                    //세미나사용언어이름
        vm.seminaData.progrsUserSeq = resData.progrsUserSeq;                //진행이용자일련
        vm.seminaData.progrsUserNm = resData.progrsUserNm;                  //진행이용자이름
        vm.seminaData.progrsUserEmail = resData.progrsUserEmail;            //진행이용자이메일
        vm.seminaData.smtmIntrprSeq = resData.smtmIntrprSeq;                //동시통역일련
        vm.seminaData.smtmIntrprNm = resData.smtmIntrprNm;                  //동시통역이름
        vm.seminaData.smtmIntrprEmail = resData.smtmIntrprEmail;            //동시통역이메일
        vm.seminaData.lctrUserSeqArray = resData.lctrUserSeqArray.split(",");          //강연이용자일련배열
        event.userSearchModalDefault();
        vm.seminaData.seminaStyleSe = resData.seminaStyleSe;                //세미나스타일구분
        vm.seminaData.seminaDe = util.date.addDateDash(resData.seminaDe);                          //세미나일자
        vm.seminaData.startHour = resData.seminaBeginTime.substring(0, 2);  //세미나 시작 시간
        vm.seminaData.startMinute = resData.seminaBeginTime.substring(2, 4);//세미나 시작 분
        vm.seminaData.endHour = resData.seminaEndTime.substring(0, 2);      //세미나 종료 시간
        vm.seminaData.endMinute = resData.seminaEndTime.substring(2, 4);    //세미나 종료 분
        vm.seminaData.seminaPlaceNm = resData.seminaPlaceNm;                //세미나장소명

        vm.seminaData.startPeriodDt = resData.rcritBeginDt.substring(0, 10);		//모집기간 시작일자
        vm.seminaData.endPeriodDt = resData.rcritEndDt.substring(0, 10);		//모집기간 종료일자
        vm.seminaData.startPeriodHour = resData.rcritBeginDt.substring(11, 13);	//모집기간 시작시간
        vm.seminaData.startPeriodMinute = resData.rcritBeginDt.substring(14, 16);//모집기간 시작분
        vm.seminaData.endPeriodHour = resData.rcritEndDt.substring(11, 13);		//모집기간 종료시간
        vm.seminaData.endPeriodMinute = resData.rcritEndDt.substring(14, 16);    //모집기간 종료분

        vm.seminaData.atnlcCo = resData.atnlcCo;                        //수강수
        vm.seminaData.seminaImageCn = resData.seminaImageCn;            //세미나 현수막 이미지
        vm.seminaData.seminaDc = resData.seminaDc;                      //세미나설명
        vm.seminaData.seminaCn = resData.seminaCn;                      //세미나내용
        vm.seminaData.seminaSttusSe = resData.seminaSttusSe;            //세미나상태구분 (R:미정,C:확정,D:취소)
        vm.seminaData.seminaParticipantCnt = resData.seminaParticipantCnt;  //세미나 참여자 수
        vm.seminaData.seminaUserCnt = resData.seminaUserCnt;                //세미나 신청자 수
        vm.seminaData.seminaStatus = resData.seminaStatus;                  //세미나 상태

        vm.seminaData.seminaKeywordArray = [];							//검색 키워드
        let tempUserKndCodeArray = resData.atnlcAuthorArray.split(","); 	//회원 종류
        $.each(tempUserKndCodeArray, function (index, kndCodeItem) {
            $.each(vm.authorList, function (index, authorItem) {
                if (authorItem.cmmnCode === kndCodeItem) {
                    vm.seminaData.userKndCodeArrayStr += authorItem.cmmnCodeNm;
                }
            });
            if (index !== tempUserKndCodeArray.length - 1) {
                vm.seminaData.userKndCodeArrayStr += " / "
            }
        });
        let tempKeywordArray = [];
        if (resData.seminaKwrd.indexOf(",") != -1) {
            tempKeywordArray = resData.seminaKwrd.split(",");
        } else {
            tempKeywordArray.push(resData.seminaKwrd);
        }
        for (let i = 0; i < tempKeywordArray.length; i++) {
            let keyword = tempKeywordArray[i];

            let keywordTag = "<div class='keyword dp_center side-by-side'>" + keyword + "</div>";
            $("#keywordContainer").append(keywordTag);

            vm.seminaData.seminaKeywordArray.push(keyword);
        }
    },
    userSearchModalDefault() {
        let paramMap = {};
        $.sendAjax({
            url: "/user/userInfoList.api",
            data: paramMap,
            contentType: "application/json",
            success: (res) => {
                vm.userList = res.data;
                event.makeLctrUSerTag();
            },
            error: function (e) {
                $.alert(e.responseJSON.message);
            },
        });
    },
    makeLctrUSerTag() {
        let userInfoTag = "";
        for (let i = 0; i < vm.seminaData.lctrUserSeqArray.length; i++) {
            for (let j = 0; j < vm.userList.length; j++) {
                if (vm.seminaData.lctrUserSeqArray[i] === vm.userList[j].userSeq) {
                    userInfoTag = "<div id='" + vm.userList[j].userSeq + "' class='dp_center side-by-side lctrUser'>" + vm.userList[j].userNm + "&nbsp;&nbsp;&nbsp;" + vm.userList[j].userEmail + "</div>";
                    $("#lctrUserContainer").append(userInfoTag);
                    break;
                }
            }
        }
    },
    setSeminaApply: (resData) => {
        //참여자 상세 이름(기본정보) 노출
        for (let i = 0; i < resData.length; i++) {
            if (resData[i].userAuthor === 'ST' || resData[i].userAuthor === 'TJ') {
                //순천향대학생, 텐진외대학생의 기본정보는 학번
                vm.seminaData.seminaApplyUserArray.push(resData[i].userNm + "(" + resData[i].userInnb + ")");
            } else if (resData[i].userAuthor === 'FF') {
                //교직원은 사번
                vm.seminaData.seminaApplyUserArray.push(resData[i].userNm + "(" + resData[i].userInnb + ")");
            } else if (resData[i].userAuthor === 'ETA' || resData[i].userAuthor === 'ETB') {
                //기타 수강생 - 중고생, 초등학생은 학교명
                vm.seminaData.seminaApplyUserArray.push(resData[i].userNm + "(" + resData[i].psitnNm + ")");
            } else if (resData[i].userAuthor === 'ETC') {
                vm.seminaData.seminaApplyUserArray.push(resData[i].userNm + "(" + resData[i].psitnNm + ")");
            }
        }
    },
    setSeminaParticipants: (resData) => {
        //참여자 상세 이름(기본정보) 노출
        for (let i = 0; i < resData.length; i++) {
            if (resData[i].userAuthor === 'ST' || resData[i].userAuthor === 'TJ') {
                //순천향대학생, 텐진외대학생의 기본정보는 학번
                vm.seminaData.seminaParticipantUserArray.push(resData[i].userNm + "(" + resData[i].userInnb + ")");
            } else if (resData[i].userAuthor === 'FF') {
                //교직원은 사번
                vm.seminaData.seminaParticipantUserArray.push(resData[i].userNm + "(" + resData[i].userInnb + ")");
            } else if (resData[i].userAuthor === 'ETA' || resData[i].userAuthor === 'ETB') {
                //기타 수강생 - 중고생, 초등학생은 학교명
                vm.seminaData.seminaParticipantUserArray.push(resData[i].userNm + "(" + resData[i].psitnNm + ")");
            } else if (resData[i].userAuthor === 'ETC') {
                vm.seminaData.seminaParticipantUserArray.push(resData[i].userNm + "(" + resData[i].psitnNm + ")");
            }
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
			data: {
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
					data: {"onAirAt": "N",	"seminaSeq": seminaSeq},
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
    event.init();
    vm.selectCmmnCode();
    event.getSeminaDetail();
});
