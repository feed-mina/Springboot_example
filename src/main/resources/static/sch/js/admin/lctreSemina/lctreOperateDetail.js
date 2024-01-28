let vueData = {
    lctreData: {
        startHour: "",				//강좌 시작 시간
        startMinute: "",			//강좌 시작 분
        endHour: "",				//강좌 종료 시간
        endMinute: "",				//강좌 종료 분
        lctreKndCode: "",			//강의 종류
        lctreKndCodeNm: "",
        specialLctreYn: false,		//특강여부
        specialLctreYnStr: "",		//특강여부 리터럴값
        lctreNm: "",				//강의명
        profsrName: "",				//교수명
        lctreNum: [],				//전체 강좌 수 -> length로 카운팅
        lctrePlace: "",				//강의장소
        userKndCodeArray: [], 		//회원 종류
        userKndCodeArrayStr: "",    //회원 종류 리터럴
        lctreDt: "",                //강좌일자
        studentCount: "", 			//수업 신청자 수
        lctreSj: "",		        //강좌제목
        lctreDtls: "",		        //강좌개요
        vodFileSeq: "",             //VOD파일일련
        lctreKeywordArray: [],		//검색 키워드
        lctreUserCnt: 0,             //현 수업신청자 명수
        lctreUserArray: [],         //수업신청자 배열
        lctreParticipantUserCnt: 0,  //현 수업참여자 명수
        lctreParticipantUserArray: [],//수업참여자 배열
        lctreSttusSe: "",           //강의상태구분(R:미정,C:확정,D:폐강)
        lctreStatus: "",            //수업상태
        lctreSeq: "",               //강의일련
        lctreSn: "",                //강좌일련
        smtmIntrprNm: "",            //동시통역이름
    },
    authorList: [],					//commonCode에서 받아온 회원 종류 리스트
    lctreKndCodeList: [],			//commonCode에서 받아온 강의 종류 리스트
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
                    {upperCmmnCode: "LCTRE_KND_CODE"}
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
                                case 'LCTRE_KND_CODE':
                                    vm.lctreKndCodeList = res.data;
                                    break;
                            }
                        },
                        error: function (e) {
                            $.alert(e.responseJSON.message);
                        },
                    });
                }
            },
            startLctreFn: (lctreSeq, lctreSn) => {
                event.startLctreFn(lctreSeq, lctreSn);
            },
        },
    });
    vm = app.mount('#content');
}

let event = {
    init: () => {
        $(document).on("click", "#btnList", function (e) {
            location.href = "lctreOperateList.html";
        });
        $(document).on("click", "#btnFileDownloadForRegister", function (e) {
            let lctreUserArray = vm.lctreData.lctreUserArray;
            let paramMap =
                {
                    'lctreUserArray':
                    lctreUserArray
                };
            $.sendAjax({
                url: "/lctreController/getCurrentUserListExcel.api",
                data: paramMap,
                contentType: "application/json",
                xhrFields: {
                    'responseType': 'blob'
                },
                success: (res, status, xhr) => {
                    let filename = '현재 수업신청자 현황.xlsx';
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
            let lctreParticipantUserArray = vm.lctreData.lctreParticipantUserArray;
            let paramMap =
                {
                    'lctreParticipantUserArray':
                    lctreParticipantUserArray
                };
            $.sendAjax({
                url: "/lctreController/getCurrentParticipantsListExcel.api",
                data: paramMap,
                contentType: "application/json",
                xhrFields: {
                    'responseType': 'blob'
                },
                success: (res, status, xhr) => {
                    let filename = '현재 수업참여자 현황.xlsx';
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
        $(document).on("click", "#btnUpdate", function (e) {
            let urlParams = new URL(location.href).searchParams;
            let lctreSeq = urlParams.get('lctreSeq');
            location.href = "lctreUpdt.html?lctreSeq=" + lctreSeq;
        });
        $(document).on("click", "#btnCancelLctreFx", function (e) {
            let urlParams = new URL(location.href).searchParams;
            let lctreSeq = urlParams.get('lctreSeq');
            let lctreSn = urlParams.get('lctreSn');
            location.href = "lctreFxCancel.html?lctreSeq=" + lctreSeq + "&lctreSn=" + lctreSn;
        });
        $(document).on("click", "#lctreParticipantsNum", function (e) {
            $("#lctreFxParticipantsContent").removeClass("visibil");
        });
    },
    getLctreFxDetail: () => {
        let urlParams = new URL(location.href).searchParams;
        let lctreSeq = urlParams.get('lctreSeq');
        let lctreSn = urlParams.get('lctreSn');
        let target = urlParams.get('target');
        let paramMap = {'lctreSeq': lctreSeq, 'lctreSn': lctreSn};
        $.sendAjax({
            url: "/lctreController/selectLctreFx.api",
            data: paramMap,
            contentType: "application/json",
            success: async (res) => {
                let resData = res.data;
                await event.setLctre(resData);
                await event.setLctreFx(resData);
                $.sendAjax({
                    url: "/lctreController/selectLctreFxParticipantsList.api",
                    data: paramMap,
                    contentType: "application/json",
                    success: async (LctreFxParticipantsListRes) => {
                        await event.setLctreParticipants(LctreFxParticipantsListRes.data);
                    },
                    error: function (e) {
                        $.alert(e.responseJSON.message);
                    },
                });
                $.sendAjax({
                    url: "/lctreController/selectLctreUserList.api",
                    data: paramMap,
                    contentType: "application/json",
                    success: async (lctreUserListRes) => {
                        await event.setLctreUser(lctreUserListRes.data);
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
    setLctre: (resData) => {
        vm.lctreData.lctreKndCode = resData.lctreKndCode;							//강의 종류
        $.each(vm.lctreKndCodeList, function (index, lctreKndCodeItem) {
            if (lctreKndCodeItem.cmmnCode === vm.lctreData.lctreKndCode) {
                vm.lctreData.lctreKndCodeNm += lctreKndCodeItem.cmmnCodeNm;
            }
        });

        let tempSpecialLctreYnStr = resData.speclLctreAt;							//특강여부
        if (tempSpecialLctreYnStr === 'Y') {
            vm.lctreData.specialLctreYn = true;
        } else if (tempSpecialLctreYnStr === 'N') {
            vm.lctreData.specialLctreYn = false;
        }

        vm.lctreData.lctreNm = resData.lctreNm;									//강의명
        vm.lctreData.profsrName = resData.userNm;                               //교수명
        vm.lctreData.smtmIntrprNm = resData.smtmIntrprNm;                       //동시통역명
        vm.lctreData.lctrePlace = resData.lctrePlaceNm;                         //강의장소
        let tempUserKndCodeArray = resData.atnlcAuthorArray.split(","); 			//회원 종류
        $.each(tempUserKndCodeArray, function (index, kndCodeItem) {
            $.each(vm.authorList, function (index, authorItem) {
                if (authorItem.cmmnCode === kndCodeItem) {
                    vm.lctreData.userKndCodeArrayStr += authorItem.cmmnCodeNm;
                }
            });
            if (index !== tempUserKndCodeArray.length - 1) {
                vm.lctreData.userKndCodeArrayStr += " / "
            }
        });
        if (resData.lctreUserCnt !== "") {
            vm.lctreData.lctreUserCnt = resData.lctreUserCnt;                       //현 수강신청자 명수
        } else if (resData.lctreUserCnt === undefined) {
            vm.lctreData.lctreUserCnt = 0;
        }
        vm.lctreData.lctreDescription = resData.lctreDc;							//강의설명

        vm.lctreData.lctreKeywordArray = [];										//검색 키워드
        let tempKeywordArray = [];
        if (resData.lctreKwrd.indexOf(",") != -1) {
            tempKeywordArray = resData.lctreKwrd.split(",");
        } else {
            tempKeywordArray.push(resData.lctreKwrd);
        }

        for (let i = 0; i < tempKeywordArray.length; i++) {
            let keyword = tempKeywordArray[i];

            let keywordTag = "<div class='keyword dp_center side-by-side'>" + keyword + "</div>";
            $("#keywordContainer").append(keywordTag);

            vm.lctreData.lctreKeywordArray.push(keyword);
        }

        vm.lctreData.lctreSttusSe = resData.lctreSttusSe;
        vm.lctreData.lctreSeq = resData.lctreSeq;
    },
    setLctreFx: (resData) => {
        vm.lctreData.lctreSj = resData.lctreSj;
        vm.lctreData.lctreDtls = resData.lctreDtls;
        vm.lctreData.vodFileSeq = resData.vodFileSeq;                       //VOD파일일련
        vm.lctreData.lctreDt = resData.lctreDt;
        vm.lctreData.startHour = resData.lctreBeginTime.substring(0, 2);    //강좌 시작 시간
        vm.lctreData.startMinute = resData.lctreBeginTime.substring(2, 4);  //강좌 시작 분
        vm.lctreData.endHour = resData.lctreEndTime.substring(0, 2);        //강좌 종료 시간
        vm.lctreData.endMinute = resData.lctreEndTime.substring(2, 4);     //강좌 종료 분

        vm.lctreData.lctreDt = util.date.addDateDash(resData.lctreDt);      //강좌일자
        vm.lctreData.lctreStatus = resData.lctreStatus;                     //수업상태

        if (resData.useAt === 'N') {
            vm.lctreData.lctreStatus = "휴강";
        } else if (resData.lctreSttusSe === 'D') {
            vm.lctreData.lctreStatus = "폐강";
        }
        if (resData.lctreParticipantsCnt !== "") {
            vm.lctreData.lctreParticipantUserCnt = resData.lctreParticipantsCnt;                       //현 수업참여자 명수
        } else if (resData.lctreParticipantsCnt === undefined) {
            vm.lctreData.lctreParticipantUserCnt = 0;
        }
        vm.lctreData.lctreSn = resData.lctreSn;                             //강좌번호
    },
    setLctreParticipants: (resData) => {
        //참여자 상세 이름(기본정보) 노출
        for (let i = 0; i < resData.length; i++) {
            if (resData[i].userAuthor === 'ST' || resData[i].userAuthor === 'TJ') {
                //순천향대학생, 텐진외대학생의 기본정보는 학번
                vm.lctreData.lctreParticipantUserArray.push(resData[i].userNm + "(" + resData[i].userInnb + ")");
            } else if (resData[i].userAuthor === 'FF') {
                //교직원은 사번
                vm.lctreData.lctreParticipantUserArray.push(resData[i].userNm + "(" + resData[i].userInnb + ")");
            } else if (resData[i].userAuthor === 'ETA' || resData[i].userAuthor === 'ETB') {
                //기타 수강생 - 중고생, 초등학생은 학교명
                vm.lctreData.lctreParticipantUserArray.push(resData[i].userNm + "(" + resData[i].psitnNm + ")");
            } else if (resData[i].userAuthor === 'ETC') {
                vm.lctreData.lctreParticipantUserArray.push(resData[i].userNm + "(" + resData[i].psitnNm + ")");
            }
        }
    },
    setLctreUser: (resData) => {
        //참여자 상세 이름(기본정보) 노출
        for (let i = 0; i < resData.length; i++) {
            if (resData[i].userAuthor === 'ST' || resData[i].userAuthor === 'TJ') {
                //순천향대학생, 텐진외대학생의 기본정보는 학번
                vm.lctreData.lctreUserArray.push(resData[i].userNm + "(" + resData[i].userInnb + ")");
            } else if (resData[i].userAuthor === 'FF') {
                //교직원은 사번
                vm.lctreData.lctreUserArray.push(resData[i].userNm + "(" + resData[i].userInnb + ")");
            } else if (resData[i].userAuthor === 'ETA' || resData[i].userAuthor === 'ETB') {
                //기타 수강생 - 중고생, 초등학생은 학교명
                vm.lctreData.lctreUserArray.push(resData[i].userNm + "(" + resData[i].psitnNm + ")");
            } else if (resData[i].userAuthor === 'ETC') {
                vm.lctreData.lctreUserArray.push(resData[i].userNm + "(" + resData[i].psitnNm + ")");
            }
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
    event.init();
    vm.selectCmmnCode();
    event.getLctreFxDetail();
});
