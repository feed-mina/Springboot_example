var vueData = {
    exprnData: {
        exprnCode: "",
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
        exprnWeekArray: [],			//요일
        exprnPlace: "",				//장소   
        canclNtcnArrray: [],			//
        exprnUserCnt: "",				//  
        exprnDescription: "",				//  
        exprnPlace: "",				//  
        exprnUserArray: [],			// 
        exprnParticipantUserArray: [],
        exprnUserArrayUser: "",				//   
        studentNameUser: "",				//   
        psitnNmUser: "",				//   
        userAuthorUser: "",				//  
        studentInnbUser: "",				//   
        exprnUserArrayParticipants: "",				//   
        studentNameParticipants: "",				//   
        userAuthorParticipants: "",				//  
        psitnNmParticipants: "",				//  
        studentInnbParticipants: "",				//  
        exprnUserArray: "",
        exprnSttusSe: "",
        exprnUserSeq: "",
    },
    exprnDetail: {
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

        exprnWeekArray: [],			//요일
        exprnPlace: "",				//장소   
    },
    preview: "",
    exprnOperateList: [],
    exprnUser: {},
    exprnUserList: [],
    exprnUserArray: [],
    exprnUserArrayList: {},
    searchData: {
        searchText: '',
    },

};

let vm;
const statuses = ['완료', '미완료'];
const urlParams = new URL(location.href).searchParams;
const exprnSn = urlParams.get('exprnSn');
const exprnSeq = urlParams.get('exprnSeq');
const paramMap = { 'exprnSeq': exprnSeq, 'exprnSn': exprnSn };
var vueInit = () => {
    const app = Vue.createApp({
        data() {
            return {
                ...vueData,  // vueData의 모든 속성을 풀어서 병합
                // 추가로 다른 데이터 속성이 필요하면 아래에 추가
                defaultButtonStyle: {
                    borderRadius: '10px',
                    textAlign: 'center',
                    border: '1px solid lightsalmon',
                    background: 'lightgray',
                    color: 'white'
                },
            };
        },
        methods: {
            isButtonDisabled(exprnSttusSe) {
                return exprnSttusSe === 'A';
            },
            conditionButtonStyle(exprnSttusSe) {
                if (this.isButtonDisabled(exprnSttusSe)) {
                    return {
                        border: '3px solid red',
                        background: 'pink',
                        color: 'black'
                    };
                } else {
                    return {};
                }
            },
            fnUpdateExprnAttender: async (obj) => {
                //console.log(obj) 
                for (let i = 0; i < vm.exprnUserArrayList.length; i++) {

                    //console.log(vm.exprnUserArrayList[i].exprnSttusSe)      
                    //console.log(vm.exprnUserArrayList[i].exprnSttusSeStr)  
                }
                let updateExprnParamMap =
                {
                    "exprnSttusSe": "A",
                    "exprnSeq": exprnSeq,
                    "exprnSn": exprnSn,
                    "exprnUserSeq": obj.exprnUserSeq
                }
                await $.sendAjax({
                    url: "/experience/updateExprnAttender.api",
                    data: updateExprnParamMap,
                    contentType: "application/json",
                    success: (resData) => {
                        $.alert("체험확인이 되었습니다.");
                        location.reload();

                    },
                    error: function (e) {
                        $.alert(e.responseJSON.message);
                    },
                });
            }

        }
    })
    vm = app.mount('#content');
}

let event = {

    init: () => {


        $(document).on("click", "#btnList", function (e) {
            location.href = "experienceFx.html";
        });
        $(document).on("click", "#btnFileDownloadForRegister", function (e) {
            let exprnUserArray = vm.exprnData.exprnUserArray;
            let exprnUserArrayParam =
            {
                'exprnUserArray':
                    exprnUserArray
            };
            $.sendAjax({
                url: "/experience/getCurrentUserListExcel.api",
                data: exprnUserArrayParam,
                contentType: "application/json",
                xhrFields: {
                    'responseType': 'blob'
                },
                success: (res, status, xhr) => {
                    let filename = '현재 체험신청자 현황.xlsx';
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
            let exprnParticipantUserArray = vm.exprnData.exprnParticipantUserArray;
            let exprnParticipantUserArrayParam =
            {
                'exprnParticipantUserArray':
                    exprnParticipantUserArray
            };
            $.sendAjax({
                url: "/experience/getCurrentParticipantsListExcel.api",
                data: exprnParticipantUserArrayParam,
                contentType: "application/json",
                xhrFields: {
                    'responseType': 'blob'
                },
                success: (res, status, xhr) => {
                    let filename = '현재 체험참여자 현황.xlsx';
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
        $(document).on("click", "#btnDeleteExprn", function (e) {
            $.confirm("정말 삭제하시겠습니까? 자료가 모두 사라집니다.", () => {
                $.sendAjax({
                    url: "/experience/deleteExprnOne.api",
                    data: paramMap,
                    contentType: "application/json",
                    success: (res) => {
                        let resData = res.data;

                        $.alert("입력한 내용이 모두 삭제되었습니다.", () => {
                            location.href = "experienceFx.html";
                        });
                    },
                    error: function (e) {
                        $.alert(e.responseJSON.message);
                    },
                });
            });
        });
        $(document).on("click", "#btnDeleteExprn", function (e) {
            location.href = "experienceOperateDetailCancel.html?exprnSeq=" + exprnSeq + "&exprnSn=" + exprnSn;
        });
        $(document).on("click", "#btnUpdateExprn", function (e) {
            location.href = "experienceUpdt.html?exprnSeq=" + exprnSeq + '&exprnSn=' + exprnSn;
        });

        $(document).on("click", "#exprnParticipantsNum", function (e) {
            $("#exprnFxParticipantsContent").removeClass("visibil");
        });

    },
    getexprnUserStatus: async () => {

        const ExperienceFxParticipantsListRes = await event.sendAjaxRequest("/experience/selectExperienceParticipantsList.api", paramMap);
        await event.setExperienceParticipants(ExperienceFxParticipantsListRes.data);

        const ExperienceUserRes = await event.sendAjaxRequest("/experience/selectExperienceUserList.api", paramMap);
        await event.setExperienceUser(ExperienceUserRes.data);

        //console.log(ExperienceFxParticipantsListRes.data)
        //console.log(ExperienceUserRes.data)

        vm.exprnUserArrayList = ExperienceUserRes.data;
        const {
            exprnSeq, exprnSn, exprnSttusSe, exprnUserSeq, psitnNm, reqstDt, userAuthor,
            userAuthorStr, userInnb, userNm
        } = vm.exprnUserArrayList;
    }
    // 특정 행의 상태를 가져오는 함수
    , getStatus: (index) => {
        return statuses[index];
    }

    // 특정 행의 상태를 설정하는 함수
    , setStatus: (index, status) => {
        statuses[index] = status;
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
    getExperienceFxDetail: async () => {
        const res = await event.sendAjaxRequest("/experience/selectExperienceOperate.api", paramMap);
        let resData = res.data;
        await event.setExperience(resData);
        await event.setExperienceFx(resData);

        event.getexprnUserStatus();
    }
    , setExperience: (resData) => {
        const {
            exprnKndCode, exprnPlaceNm, exprnWeekArray, exprnBeginDate, exprnEndDate, exprnParticipantsCnt, exprnRegisterCnt,
            exprnCo, canclDc, canclNtcnArray, exprnKndCodeStr, exprnSttusSe, canclCode,
            exprnSeq, exprnSn, rcritBeginDate, rcritBeginHour, rcritBeginMinutes,
            rcritEndDate, rcritEndHour, rcritEndMinutes
        } = resData;
        resData = vm.exprnData
        Object.assign(vm.exprnData, {
            exprnKndCode, exprnPlaceNm, exprnBeginDate, exprnEndDate, exprnParticipantsCnt, exprnRegisterCnt,
            canclDc, canclNtcnArray, exprnKndCodeStr, exprnSttusSe, exprnSeq, rcritBeginDate, canclCode,
            rcritBeginHour, rcritBeginMinutes, rcritEndDate, rcritEndHour, rcritEndMinutes
        });
        vm.exprnData.exprnUserCount = vm.exprnData.exprnRegisterCnt + vm.exprnData.exprnParticipantsCnt
        vm.exprnData.exprnRegisterCnt = vm.exprnData.exprnRegisterCnt || 0;
        vm.exprnData.exprnWeekArray = exprnWeekArray === "" ? exprnWeekArray.split(',') : exprnWeekArray || [];
        vm.exprnData.exprnCo = exprnCo !== "" ? exprnCo : 0;

        let paramMap = { 'exprnSeq': exprnSeq, 'exprnSn': exprnSn };


    }
    ,
    setExperienceFx: (resData) => {
        const {
            exprnWeekArray, exprnDate, exprnPlaceNm, exprnCo, rcritBeginDt, rcritEndDt,
            exprnBeginDate, exprnEndDate, exprnBeginTimeHour, exprnBeginTimeMinutes,
            exprnEndTimeHour, exprnEndTimeMinutes, exprnSttusSe, exprnUserArray, exprnUserSeq, exprnSn
        } = resData;

        Object.assign(vm.exprnData, {
            exprnWeekArray: exprnWeekArray.split(','), exprnDate, exprnPlaceNm, exprnCo,
            rcritBeginDt, rcritEndDt, exprnBeginDate, exprnEndDate,
            exprnBeginTimeHour, exprnBeginTimeMinutes, exprnEndTimeHour,
            exprnEndTimeMinutes, exprnSttusSe, exprnUserArray, exprnUserSeq, exprnSn
        });
    },
    setExperienceUser: (resData) => {
       
        let ExprnCancelButtonTag = "<a   href='#' class='btn btn-google btn-icon btn_search_width' ><span class='text'>체험예약 취소</span></a>"
      

        if (resData.length > 0 && resData[0].exprnSeq === vm.exprnData.exprnSeq) {
      $("#btnCancelExprn").append(ExprnCancelButtonTag);
        }  

        vm.exprnData.exprnUserArray = [];

        for (const userData of resData) {
            const {
                exprnSeq, psitnNm, userAuthorStr, userNm, userInnb, reqstDt,
                exprnUserSeq, exprnSttusSe
            } = userData;

            vm.exprnData.exprnUserArrayUser = exprnUserSeq;
            vm.exprnData.tudentNameUSer = userNm;
            vm.exprnData.psitnNmUSer = psitnNm;
            vm.exprnData.userAuthorUser = userAuthorStr;
            vm.exprnData.exprnSn = exprnSeq;
            let exprnRegisterInfo = `${exprnUserSeq}${userAuthorStr}${userNm}${psitnNm}${userInnb}`;
            vm.exprnData.exprnRegisterInfo = exprnRegisterInfo;

            const userInfoString = `${exprnUserSeq}(${userNm})(${psitnNm})(${userInnb})`;

            // User Author condition
            const allowedAuthors = ['ST', 'TJ', 'FF', 'ETA', 'ETB', 'ETC', 'G'];
            if (allowedAuthors.includes(userData.userAuthor)) {
                vm.exprnData.exprnUserArray.push(userInfoString);
            }
        }
        const exprnCanclInfo = vm.exprnData.canclCode || vm.exprnData.canclDc || vm.exprnData.canclNtcnArray
        
        if(vm.exprnData.exprnUserCount > 0){
        if (exprnCanclInfo || vm.exprnData.exprnUserArray.length > 0) {
            let btnDeleteExprnElement = document.getElementById('btnDeleteExprn');
            btnDeleteExprnElement.style.border = '1px solid lightsalmon';  
            btnDeleteExprnElement.style.backgroundColor = 'lightgray'; 
        }
    }
    }
    ,
    setExperienceParticipants: (resData) => {
 
        console.log(resData[0].experienceUserCount)  

        if (resData[0].experienceUserCount == 0) {
            let ExprnDeleteButtonTag = "<a href='#' class='btn btn-google btn-icon btn_search_width' id='btnDeleteExprn'><span class='text' >삭제</span>  </a>"
            let ExprnUpdateButtonTag = "<a href='#'  class='btn btn-icon btn-primary btn_search_width'  id='btnUpdateExprn'  ><span class='text'>수정</span>  </a>"
          //  $("#btnDeleteExprn").append(ExprnDeleteButtonTag);
            $("#btnUpdateExprn").append(ExprnUpdateButtonTag);

        } else if (resData[0].experienceUserCount != 0) {

            console.log('목록만 보이게 한다. ') 
        }
         

               // 초기 설정 및 데이터 확인
               vm.exprnData.exprnParticipantUserCnt = (resData.length && resData[0].exprnSeq === vm.exprnData.exprnSeq) ? resData.length : 0;
               vm.exprnData.exprnParticipantUserArray = [];
       
               const formatParticipantInfo = (data) => {
                   return `${data.exprnUserSeq}(${data.userNm})(${data.psitnNm})(${data.userInnb})`;
               };
       
               // 참여자 정보 처리
               resData.forEach(data => {
                   // 일부 필드 업데이트
                   vm.exprnData.exprnParticipantUserArrayUser = data.exprnUserSeq;
                   vm.exprnData.studentNameUser = data.userNm;
                   vm.exprnData.psitnNmUser = data.psitnNm;
                   vm.exprnData.userAuthorUser = data.useAuthor;
                   vm.exprnData.exprnSn = data.exprnSn;
                   vm.exprnData.exprnParticipantInfo = formatParticipantInfo(data);
       
                   // 특정 userAuthor 값에 따라 배열에 정보 추가
                   if (['ST', 'TJ', 'FF', 'ETA', 'ETB', 'ETC', 'G'].includes(data.userAuthor)) {
                       vm.exprnData.exprnParticipantUserArray.push(formatParticipantInfo(data));
                   }
               });
    }
    , getExperienceUserList: () => {
        $.sendAjax({
            url: "/experience/selectExprnOperateList.api",
            data: vm.searchData,
            contentType: "application/json",
            success: async (res) => {
                vm.exprnList = res.data;
                let resData = res.data;
                console.log(resData)
                await event.setExperienceUserList(resData);

            }
            , error: function (e) {
                $.alert(e.responseJSON.message);
            }
        });
    }
    , setExperienceUserList: (resData) => {
        //console.log(resData) 
        let resDataSn = Object.keys(resData.list)
        let data = Object.values(resData.list).flat(); // 객체의 모든 값을 하나의 배열로 합칩니다.

        vm.exprnSeqPer = exprnSeq
        let groupedData = {};
        // exprnSeq 값을 기준으로 객체를 묶기.
        data.forEach(item => {
            if (!groupedData[item.exprnSeq]) {
                groupedData[item.exprnSeq] = [];
            }

            // //console.log(item)
            groupedData[item.exprnSeq].push(item)
        });

        //console.log(groupedData)
        let groupedDataKey = Object.keys(groupedData) 
        let groupedPerData = {};
        //console.log(Object.values(Object.keys(groupedDataKey)))
        //console.log(exprnSeq) 
        for (var k = 0; k < Object.keys(groupedData).length; k++) {

            ////console.log(Object.keys(groupedData)[k])
            if (exprnSeq == Object.keys(groupedData)[k]) {
                //	//console.log(k)  그룹화된 전체 array에서 exprnSeq의 값에 맞는 idx
                //console.log(Object.values(groupedData)[k].length)
                //console.log(Object.values(groupedData)[k])

                let groupedDataValue = Object.values(groupedData)[k]
                let dataGrouped = groupedDataValue.flat();

                // exprnSeq 값을 기준으로 객체를 묶기.
                dataGrouped.forEach(item => {
                    let experienceUserPerCnt = item.experienceUserCnt

                    if (!groupedPerData[experienceUserPerCnt]) {
                        groupedPerData[experienceUserPerCnt] = [];
                    }
                    groupedPerData[experienceUserPerCnt].push(item)
                });

                let groupedUserCnt = Object.keys(groupedPerData)
                let grupedPerTimeValue = Object.values(groupedPerData)
                const groupedUserCntSum = groupedUserCnt.reduce((acc, currentValue) => acc + Number(currentValue), 0);

                if (groupedUserCntSum <= 0) {
                    $(document).on("click", "#btnUpdateExprn", function (e) {
                        location.href = "experienceUpdt.html?exprnSeq=" + exprnSeq
                    }); 
                    if (vm.exprnData.exprnRegisterCnt == undefined) {
                        vm.exprnData.exprnRegisterCnt = 0
                    }
                    return null;
                }

            }
        }



    }
};





$(document).ready(() => {
    vueInit();
    event.getExperienceFxDetail();
    event.getExperienceUserList();
    event.init();

});




