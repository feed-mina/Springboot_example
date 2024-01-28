var vueData = {
    cnsltData: {
        startHour: "",				// 시작 시간
        startMinute: "",			// 시작 분
        endHour: "",				// 종료 시간
        endMinute: "",				// 종료 분
        startDt: "",				// 기간 시작일자
        endDt: "",					// 기간 종료일자
        startPeriodDt: "",			//모집기간 시작일자
        endPeriodDt: "",			//모집기간 종료일자
        startPeriodHour: "",		//모집기간 시작시간
        startPeriodMinute: "",		//모집기간 시작분
        endPeriodHour: "",			//모집기간 종료시간
        endPeriodMinute: "",		//모집기간 종료분 
        userNm: "",				//교수명   
        userEmail : "",
        cnsltWeekArray: [],			//요일
        cnsltPlace: "",				//장소   
        cnsltUserCnt: "",				//  
        cnsltPlace: "",				//  
        cnsltUserArray: [],			// 
        cnsltParticipantUserArray: [],
        cnsltUserArrayUser: "",				//   
        studentNameUser: "",				//   
        psitnNmUser: "",				//   
        studentInnbUser: "",				//   
        cnsltUserArrayParticipants: "",				//  
    }
    , preview: "",
    searchData: {
        searchText: '',
    },
};
const urlParams = new URL(location.href).searchParams;
const cnsltSeq = urlParams.get('cnsltSeq');
const cnsltSn = urlParams.get('cnsltSn');

const paramMap = { 'cnsltSeq': cnsltSeq, 'cnsltSn': cnsltSn };
let vm;
var vueInit = () => {
    const app = Vue.createApp({
        data() {
            return vueData;
        },
        methods: {
            FnStart: (cnsltSeq, cnsltSn) => {
                event.StartCnslt(cnsltSeq, cnsltSn);
            }

        }
    })
    vm = app.mount('#content');
}

let event = {
    init: () => {

        getCmmnCodeList: async () => {
            let param = {
                upperCmmnCode: 'CNSLT_CANCEL_REASON'
            }
            const res = await event.sendAjaxRequest("/cmmn/selectCmmnCode.api", paramMap);
            let resData = res.data;
            vm.cmmnCode = res.data;
        },

            $(document).on("click", "#btnDeleteCnslt", function (e) {
                $.confirm("정말 삭제하시겠습니까? 자료가 모두 사라집니다.", () => {
                    $.sendAjax({
                        url: "/consult/deleteCnsltOne.api",
                        data: paramMap,
                        contentType: "application/json",
                        success: (res) => {
                            let resData = res.data;

                            $.alert("입력한 내용이 모두 삭제되었습니다.", () => {
                                location.href = "consultFx.html";
                            });
                        },
                        error: function (e) {
                            $.alert(e.responseJSON.message);
                        },
                    });
                });
            });
        $(document).on("click", "#btnFileDownloadForUserList", function (e) {

            let cnsltUserArray = vm.cnsltData.cnsltUserArray;
            let paramMap = { 'cnsltUserArray': cnsltUserArray };
            $.sendAjax({
                url: "/consult/getCurrentUserListExcel.api",
                data: paramMap,
                contentType: "application/json",
                xhrFields: {
                    'responseType': 'blob'
                },
                success: (res, status, xhr) => {
                    let filename = '현재 상담신청자 현황.xlsx';
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
            let cnsltParticipantUserArray = vm.cnsltData.cnsltParticipantUserArray;
            let paramMap =
            {
                'cnsltParticipantUserArray':
                    cnsltParticipantUserArray
            };
            $.sendAjax({
                url: "/consult/getCurrentParticipantsListExcel.api",
                data: paramMap,
                contentType: "application/json",
                xhrFields: {
                    'responseType': 'blob'
                },
                success: (res, status, xhr) => {
                    let filename = '현재 상담완료자 현황.xlsx';
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
        $(document).on("click", "#btnCancelCnslt", function (e) {
            location.href = "consultOperateDetailCancel.html?cnsltSeq=" + cnsltSeq + '&cnsltSn=' + cnsltSn;
        });

        $(document).on("click", "#btnUpdateCnslt", function (e) {
            location.href = "consultUpdt.html?cnsltSeq=" + cnsltSeq;

        }); 
    }
    , StartCnslt: async (cnsltSeq, cnsltSn) => {
        //$.alert("지시밋.")
        let paramMap =
        {
            "onAirAt": "Y",
            "cnsltSeq": vm.cnsltData.cnsltSeq,
            "cnsltSn": vm.cnsltData.cnsltSn
        }
        // await flag change to on_Air_at Y
        await $.sendAjax({
            url: "/consult/updateCnsltOnAirAt.api",
            data: paramMap,
            contentType: "application/json",
            success: async (res) => {
				event.updateOnAirCnslt(vm.cnsltData.cnsltSeq, vm.cnsltData.cnsltSn)

                //console.log('updateCnsltOnAirAt성공')
                await event.gitSiMeetSetting(cnsltSeq, cnsltSn);
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
    }
    // await get token
    , gitSiMeetSetting: async (cnsltSeq, cnsltSn) => {
        const jwtData = await $.sendAjax({
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
        });

        const token = jwtData.data.token;

        const options = {
            jwt: token,
            roomName: "cnslt" + "-" + vm.cnsltData.cnsltSeq + "-" + vm.cnsltData.cnsltSn, //cnslt-CNSLT_000123-3
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
        const domain = JITSI_URL;
        // open jitsi meet
        const api = new window.JitsiMeetExternalAPI(domain, options);
		window.onbeforeunload = function(event) {
            $.sendAjax({
                url: "/consult/updateCnsltOnAirAt.api",
                data:   {"onAirAt": "N","cnsltSeq": vm.cnsltData.cnsltSeq,"cnsltSn": vm.cnsltData.cnsltSn},
                contentType: "application/json",
                success: (res) => {
                },
                error: function (e) {
                },
            });
		}
        // jitsi-meet close event -> flag change on_Air_at N

        api.addEventListener("readyToClose", (e) => {
            api.dispose();
            // flag -> on_AIRT N
            let paramMap =
            {
                "onAirAt": "N",
                "cnsltSeq": vm.cnsltData.cnsltSeq,
                "cnsltSn": vm.cnsltData.cnsltSn
            };
            $.sendAjax({
                url: "/consult/updateCnsltOnAirAt.api",
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
    },
    sendAjaxRequest: (url, data) => {
        return new Promise((resolve, reject) => {
            $.sendAjax({
                url,
                data,
                contentType: "application/json",
                success: (response) => resolve(response),
                error: (e) => reject(e)
            });
        });
    },
    getConsultFxDetail: async () => {
        let paramMap = { 'cnsltSeq': cnsltSeq, 'cnsltSn': cnsltSn };
        const ConsultOperateRes = await event.sendAjaxRequest("/consult/selectConsultOperate.api", paramMap);
        let ConsultOperateResData = ConsultOperateRes.data;
        await event.setConsult(ConsultOperateResData);
        await event.setConsultFx(ConsultOperateResData); 

        event.getcnsltUserStatus();

    }
    , setConsult: (resData) => {
        console.log(resData)
        const {
            cnsltKndCode, userNm, userEmail, cnsltPlaceNm, cnsltWeekArray, cnsltBeginDate, cnsltEndDate, cnsltCo, canclDc, canclNtcnArray, cnsltSttusSe, cnsltSeq, rcritBeginDate, rcritBeginHour, rcritBeginMinutes, rcritEndDate, rcritEndHour, rcritEndMinutes,  cnsltDate, cnsltBeginTimeHour, cnsltBeginTimeMinutes, cnsltEndTimeHour, cnsltEndTimeMinutes, cnsltDt, cnsltStatus, useAt, cnsltSn, cnsltUserSeq 
        } = resData;
        resData = vm.cnsltData   
        Object.assign(vm.cnsltData, {
            cnsltWeekArray: cnsltWeekArray.split(','), cnsltKndCode,   cnsltPlaceNm,  cnsltBeginDate, cnsltEndDate, cnsltCo, canclDc, canclNtcnArray, cnsltSttusSe, cnsltSeq, rcritBeginDate, rcritBeginHour, rcritBeginMinutes,
            rcritEndDate, rcritEndHour, rcritEndMinutes,  cnsltDate, cnsltBeginTimeHour, cnsltBeginTimeMinutes, cnsltEndTimeHour, cnsltEndTimeMinutes, cnsltDt, cnsltStatus, useAt, cnsltSn, cnsltUserSeq , userNm, userEmail
        });

    },
    setConsultFx: (resData) => {

		 
        if (vm.cnsltData.cnsltKndCode === 'CNSLT_KND_CODE_1'){
            vm.cnsltData.cnsltSeStr =  '개인상담'
        }else{
            vm.cnsltData.cnsltSeStr =  '그룹상담'
        }

        //resData = vm.cnsltData
        if (resData.useAt === 'N') {
            vm.cnsltData.cnsltStatus = "출석";
        } else if (resData.cnsltSttusSe === 'A') {
            vm.cnsltData.cnsltStatus = "출석";
        } else if (resData.cnsltSttusSe === 'N') {
            vm.cnsltData.cnsltStatus = "결석";
        }

    }
    ,getcnsltUserStatus: async () => {
        let paramMap = { 'cnsltSeq': cnsltSeq, 'cnsltSn':cnsltSn }

        const ConsultUserListRes = await event.sendAjaxRequest("/consult/selectConsultUserList.api", paramMap);
        let ConsultUserListResData = ConsultUserListRes.data;
        console.log(ConsultUserListResData)
        await event.setConsultUser(ConsultUserListResData);
        const ConsultFxParticipantsListRes = await event.sendAjaxRequest("/consult/selectConsultParticipantsList.api", paramMap);
        let ConsultParticipantsResData = ConsultFxParticipantsListRes.data
        await event.setConsultParticipants(ConsultParticipantsResData); 
        console.log(ConsultUserListResData) 
        console.log(ConsultParticipantsResData)  
        console.log(ConsultUserListResData[0].consultUserCount) 
        console.log(ConsultParticipantsResData[0].consultUserCount)  
        vm.cnsltData.cnsltParticipantUserCnt = ConsultParticipantsResData[0].consultUserCount
        vm.consultUserCount = ConsultParticipantsResData[0].consultUserCount + ConsultUserListResData[0].consultUserCount
    
        vm.cnsltData.cnsltRegisterCnt = vm.consultUserCount
        let CnsltCancelButtonTag = " <a  id='btnCancelCnslt' href='#'  class='btn btn-orange btn-icon btn_search_width' ><span class='text'>상담취소</span>  </a>"
     //   let CnsltDeleteButtonTag = "<a href='#' class='btn btn-icon btn-google btn_search_width' id='btnDeleteCnslt'><span class='text'>삭제</span>  </a>"
        let CnsltUpdateButtonTag = " <a href='#'  class='btn btn-icon btn-primary btn_search_width'  id='btnUpdateCnslt' ><span class='text'>수정</span>  </a>"

        if(vm.consultUserCount > 0){

            $("#btnCancelCnslt").append(CnsltCancelButtonTag);
        }else if(vm.consultUserCount === 0 ){
            $("#btnUpdateCnslt").append(CnsltUpdateButtonTag);
         //   $("#btnDeleteCnslt").append(CnsltDeleteButtonTag);
        }
    }, setConsultUser: (resData) => { 
        //참여자 상세 이름(기본정보) 노출
        if (resData.length > 0 && resData[0].cnsltSeq == vm.cnsltData.cnsltSeq) {

        } else {
        }

        if (vm.cnsltData.cnsltDescription || vm.cnsltData.canclNtcnArray) {
            let btnCancelCnsltElement = document.getElementById('btnCancelCnslt');
            btnCancelCnsltElement.style.border = '1px solid lightsalmon'; // 예시: 빨간색 경계선
            btnCancelCnsltElement.style.backgroundColor = 'lightgray'; // 예시: 회색 배경색
        }


        for (let i = 0; i < resData.length; i++) {
            vm.cnsltData.cnsltUserArrayUser == resData[i].cnsltUserSeq;
            vm.cnsltData.studentNameUser == resData[i].userNm;
            vm.cnsltData.psitnNmUser == resData[i].psitnNm;
            vm.cnsltData.userAuthorUser == resData[i].userAuthor;
            vm.cnsltData.studentInnbUser == resData[i].userInnb;
            vm.cnsltData.cnsltSn == resData[i].cnsltSn;
            vm.cnsltData.cnsltRegisterInfo == resData[i].cnsltUserSeq + resData[i].userAuthor + resData[i].userNm + resData[i].psitnNm + resData[i].userInnb;
            let cnsltRegisterInfo = resData[i].cnsltUserSeq + resData[i].userAuthor + resData[i].userNm + resData[i].psitnNm + resData[i].userInnb


            if (cnsltRegisterInfo != '') {
                let cnsltRegisterInfoTag = "<div class=' 'input-group' id='' > <div> <span class='dp_center side-by-side' id=''>" + resData[i].userNm + "</span>  <span class='dp_center side-by-side' id=''>" + "(" + resData[i].userInnb + ")" + "</span>" + "/" + "</div></div>"
                $("#boxForUserList").append(cnsltRegisterInfoTag);
                // 요소를 선택합니다.
                var element = document.getElementById("UsefInfoLine");

                // CSS 속성을 설정합니다.
                element.style.display = "flex";
                element.style.border = "1px solid black";
                element.style.padding = "20px";
                element.style.margin = "20px";
            }

            // ST : 재학생 // TJ : 텐진 
            if (resData[i].userAuthor === 'ST' || resData[i].userAuthor === 'TJ') {
                vm.cnsltData.cnsltUserArray.push(resData[i].cnsltUserSeq + "(" + resData[i].userNm + ")" + "(" + resData[i].psitnNm + ")" + "(" + resData[i].userInnb + ")");
                //기타 수강생 -  FF: 교직원은 사번
            } else if (resData[i].userAuthor === 'FF') {
                vm.cnsltData.cnsltUserArray.push(resData[i].cnsltUserSeq + "(" + resData[i].userNm + ")" + "(" + resData[i].psitnNm + ")" + "(" + resData[i].userInnb + ")");
                //기타 수강생 - ETA: 중고생, ETB : 초등학생은 학교명
            } else if (resData[i].userAuthor === 'ETA' || resData[i].userAuthor === 'ETB') {
                vm.cnsltData.cnsltUserArray.push(resData[i].cnsltUserSeq + "(" + resData[i].userNm + ")" + "(" + resData[i].psitnNm + ")" + "(" + resData[i].userInnb + ")");
                // ETC : 지역주민
            } else if (resData[i].userAuthor === 'ETC') {
                vm.cnsltData.cnsltUserArray.push(resData[i].cnsltUserSeq + "(" + resData[i].userNm + ")" + "(" + resData[i].psitnNm + ")" + "(" + resData[i].userInnb + ")");
                // 기타 수강생 - G: 게스트
            } else if (resData[i].userAuthor === 'G') {
                vm.cnsltData.cnsltUserArray.push(resData[i].cnsltUserSeq + "(" + resData[i].userNm + ")" + "(" + resData[i].psitnNm + ")" + "(" + resData[i].userInnb + ")");
            }
        }

    },
    setConsultParticipants: (resData) => {
     
        vm.cnsltData.cnsltCo !== "" ? cnsltCo : 0;
     

        //참여자 상세 이름(기본정보) 노출
        for (let i = 0; i < resData.length; i++) {
            vm.cnsltData.cnsltParticipantUserArrayUser == resData[i].cnsltUserSeq;
            vm.cnsltData.studentNameUser == resData[i].userNm;
            vm.cnsltData.psitnNmUser == resData[i].psitnNm;
            vm.cnsltData.userAuthorUser == resData[i].userAuthor;
            vm.cnsltData.studentInnbUser == resData[i].userInnb;
            vm.cnsltData.cnsltSn == resData[i].cnsltSn;
            vm.cnsltData.cnsltParticipantInfo == resData[i].cnsltUserSeq + resData[i].userAuthor + resData[i].userNm + resData[i].psitnNm + resData[i].userInnb;
            let cnsltParticipantInfo = resData[i].cnsltUserSeq + resData[i].userAuthor + resData[i].userNm + resData[i].psitnNm + resData[i].userInnb


            // ST : 재학생  TJ : 텐진  /순천향대학생, 텐진외대학생의 기본정보는 학번
            if (resData[i].userAuthor === 'ST' || resData[i].userAuthor === 'TJ') {
                vm.cnsltData.cnsltParticipantUserArray.push(resData[i].cnsltUserSeq + "(" + resData[i].userNm + ")" + "(" + resData[i].psitnNm + ")" + "(" + resData[i].userInnb + ")");

                //기타 수강생 -  FF: 교직원은 사번
            } else if (resData[i].userAuthor === 'FF') {
                vm.cnsltData.cnsltParticipantUserArray.push(resData[i].cnsltUserSeq + "(" + resData[i].userNm + ")" + "(" + resData[i].psitnNm + ")" + "(" + resData[i].userInnb + ")");

                //기타 수강생 - ETA: 중고생, ETB : 초등학생은 학교명
            } else if (resData[i].userAuthor === 'ETA' || resData[i].userAuthor === 'ETB') {
                vm.cnsltData.cnsltParticipantUserArray.push(resData[i].cnsltUserSeq + "(" + resData[i].userNm + ")" + "(" + resData[i].psitnNm + ")" + "(" + resData[i].userInnb + ")");
                // ETC : 지역주민
            } else if (resData[i].userAuthor === 'ETC') {
                vm.cnsltData.cnsltParticipantUserArray.push(resData[i].cnsltUserSeq + "(" + resData[i].userNm + ")" + "(" + resData[i].psitnNm + ")" + "(" + resData[i].userInnb + ")");
                // 기타 수강생 - G: 게스트
            } else if (resData[i].userAuthor === 'G') {
                vm.cnsltData.cnsltUserArray.push(resData[i].cnsltUserSeq + "(" + resData[i].userNm + ")" + "(" + resData[i].psitnNm + ")" + "(" + resData[i].userInnb + ")");
            }

        }
    },
    setConsultTimeList: (resData) => {
        console.log(resData)
        let data = Object.values(resData.list).flat(); // 객체의 모든 값을 하나의 배열로 합칩니다.

        vm.cnsltSeqPer = cnsltSeq
        let groupedData = {};
        // cnsltSeq 값을 기준으로 객체를 묶기.
        data.forEach(item => {
            if (!groupedData[item.cnsltSeq]) {
                groupedData[item.cnsltSeq] = [];
            }

            //console.log(item)
            groupedData[item.cnsltSeq].push(item)
        });

        //console.log(groupedData)  
        let groupedPerData = {};
        for (var k = 0; k < Object.keys(groupedData).length; k++) {

            if (cnsltSeq == Object.keys(groupedData)[k]) {
                // 그룹화된 전체 array에서 cnsltSeq의 값에 맞는 idx

                //console.log(Object.values(groupedData)[k]) 
                let groupedDataValue = Object.values(groupedData)[k]
                let dataGrouped = groupedDataValue.flat();

                // cnsltSeq 값을 기준으로 객체를 묶기.
                dataGrouped.forEach(item => {
                    let consultUserPerCnt = item.consultUserCnt
                    if (!groupedPerData[consultUserPerCnt]) {
                        groupedPerData[consultUserPerCnt] = [];
                    }
                    groupedPerData[consultUserPerCnt].push(item)
                });
                let groupedUserCnt = Object.keys(groupedPerData)
                let grupedPerTimeValue = Object.values(groupedPerData)
                const groupedUserCntSum = groupedUserCnt.reduce((acc, currentValue) => acc + Number(currentValue), 0);

            }
        }
    },
    getConsultTimeList: async () => {

        const CnsltOperateListRes = await event.sendAjaxRequest("/consult/selectCnsltOperateList.api", vm.searchData);
        let CnsltOperateListResData = CnsltOperateListRes.data;
        await event.setConsultTimeList(CnsltOperateListResData);
        vm.consultTimeList = CnsltOperateListResData;

    },

	updateOnAirCnslt: async (cnsltSeq, cnsltSn) => {
		// nodejs 통해서 onAir 시그널 보내기
		$.sendAjax({
			url: NODE_URL + "/node/onAirCnslt",
			data: {
				code: "cnslt-" + cnsltSeq + "-" + cnsltSn
			},
			contentType: "application/json",
			success: (res) => {
			},
			error: function (e) {
			},
		})
	}
};





$(document).ready(() => {
    event.init();
    vueInit();
    event.getConsultFxDetail();
    event.getConsultTimeList();

});




