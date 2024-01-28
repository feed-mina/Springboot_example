var vueData = {
    exprnData: {
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
        exprnWeekArray: [],			//요일
        exprnPlace: "",				//장소   
        exprnUserCnt: "",				//  
        exprnPlace: "",				//  
        exprnUserArray: [],			// 
        exprnParticipantUserArray: [],
        exprnUserArrayUser: "",				//   
        studentNameUser: "",				//   
        psitnNmUser: "",				//   
        studentInnbUser: "",				//   
        exprnUserArrayParticipants: "",				//  
    }
    , preview: "",
    searchData: {
        searchText: '',
    },
};
const urlParams = new URL(location.href).searchParams;
const exprnSeq = urlParams.get('exprnSeq');
const exprnSn = urlParams.get('exprnSn');

const paramMap = { 'exprnSeq': exprnSeq, 'exprnSn': exprnSn };
let vm;
var vueInit = () => {
    const app = Vue.createApp({
        data() {
            return vueData;
        },
        methods: { 
        }
    })
    vm = app.mount('#content');
}

let event = {
    init: () => {

        getCmmnCodeList: async () => {
            let param = {
                upperCmmnCode: 'exprn_CANCEL_REASON'
            }
            const res = await event.sendAjaxRequest("/cmmn/selectCmmnCode.api", paramMap);
            let resData = res.data;
            vm.cmmnCode = res.data;
        },

            $(document).on("click", "#btnDeleteexprn", function (e) {
                $.confirm("정말 삭제하시겠습니까? 자료가 모두 사라집니다.", () => {
                    $.sendAjax({
                        url: "/experience/deleteexprnOne.api",
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
        $(document).on("click", "#btnFileDownloadForUserList", function (e) {

            let exprnUserArray = vm.exprnData.exprnUserArray;
            let paramMap = { 'exprnUserArray': exprnUserArray };
            $.sendAjax({
                url: "/experience/getCurrentUserListExcel.api",
                data: paramMap,
                contentType: "application/json",
                xhrFields: {
                    'responseType': 'blob'
                },
                success: (res, status, xhr) => {
                    let filename = '현재 체험예약신청자 현황.xlsx';
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
            let paramMap =
            {
                'exprnParticipantUserArray':
                    exprnParticipantUserArray
            };
            $.sendAjax({
                url: "/experience/getCurrentParticipantsListExcel.api",
                data: paramMap,
                contentType: "application/json",
                xhrFields: {
                    'responseType': 'blob'
                },
                success: (res, status, xhr) => {
                    let filename = '현재 체험예약완료자 현황.xlsx';
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
        $(document).on("click", "#btnCancelexprn", function (e) {
            location.href = "experienceOperateDetailCancel.html?exprnSeq=" + exprnSeq + '&exprnSn=' + exprnSn;
        });

        $(document).on("click", "#btnUpdateexprn", function (e) {
            location.href = "experienceUpdt.html?exprnSeq=" + exprnSeq;

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
    getexperienceFxDetail: async () => {
        let paramMap = { 'exprnSeq': exprnSeq, 'exprnSn': exprnSn };
        const res = await event.sendAjaxRequest("/experience/selectExperienceOperate.api", paramMap);
        let resData = res.data;
        let experienceOperateResData = experienceOperateRes.data;
        await event.setExperience(resData);
        await event.setExperienceFx(resData); 

        event.getexprnUserStatus();

    }
    , setexperience: (resData) => {
        console.log(resData)
        const {
            exprnKndCode, userNm, userEmail, exprnPlaceNm, exprnWeekArray, exprnBeginDate, exprnEndDate, exprnCo, canclDc, canclNtcnArray, exprnSttusSe, exprnSeq, rcritBeginDate, rcritBeginHour, rcritBeginMinutes, rcritEndDate, rcritEndHour, rcritEndMinutes,  exprnDate, exprnBeginTimeHour, exprnBeginTimeMinutes, exprnEndTimeHour, exprnEndTimeMinutes, exprnDt, exprnStatus, useAt, exprnSn, exprnUserSeq 
        } = resData;
        resData = vm.exprnData   
        Object.assign(vm.exprnData, {
            exprnKndCode, exprnPlaceNm, exprnBeginDate, exprnEndDate, exprnParticipantsCnt, exprnRegisterCnt,
            canclDc, canclNtcnArray, exprnKndCodeStr, exprnSttusSe, exprnSeq, rcritBeginDate, canclCode,
            rcritBeginHour, rcritBeginMinutes, rcritEndDate, rcritEndHour, rcritEndMinutes
        });
        Object.assign(vm.exprnData, {
            exprnWeekArray: exprnWeekArray.split(','), exprnKndCode,   exprnPlaceNm,  exprnBeginDate, exprnEndDate, exprnCo, canclDc, canclNtcnArray, exprnSttusSe, exprnSeq, rcritBeginDate, rcritBeginHour, rcritBeginMinutes,
            rcritEndDate, rcritEndHour, rcritEndMinutes,  exprnDate, exprnBeginTimeHour, exprnBeginTimeMinutes, exprnEndTimeHour, exprnEndTimeMinutes, exprnDt, exprnStatus, useAt, exprnSn, exprnUserSeq , userNm, userEmail
        });
        vm.exprnData.exprnUserCount = vm.exprnData.exprnRegisterCnt + vm.exprnData.exprnParticipantsCnt
        vm.exprnData.exprnRegisterCnt = vm.exprnData.exprnRegisterCnt || 0;
        vm.exprnData.exprnWeekArray = exprnWeekArray === "" ? exprnWeekArray.split(',') : exprnWeekArray || [];
        vm.exprnData.exprnCo = exprnCo !== "" ? exprnCo : 0;

    },
    setexperienceFx: (resData) => { 
        console.log(resData)
      
        const {
            exprnWeekArray, exprnDate, exprnPlaceNm, exprnCo, rcritBeginDt, rcritEndDt,
            exprnBeginDate, exprnEndDate, exprnBeginTimeHour, exprnBeginTimeMinutes,
            exprnEndTimeHour, exprnEndTimeMinutes, exprnSttusSe, exprnUserArray, exprnUserSeq, exprnSn
        } = resData;
        resData = vm.exprnData
      
        Object.assign(vm.exprnData, {
            exprnWeekArray: exprnWeekArray.split(','), exprnDate, exprnPlaceNm, exprnCo,
            rcritBeginDt, rcritEndDt, exprnBeginDate, exprnEndDate,
            exprnBeginTimeHour, exprnBeginTimeMinutes, exprnEndTimeHour,
            exprnEndTimeMinutes, exprnSttusSe, exprnUserArray, exprnUserSeq, exprnSn
        });
      
        if (resData.useAt === 'N') {
            vm.exprnData.exprnStatus = "출석";
        } else if (resData.exprnSttusSe === 'A') {
            vm.exprnData.exprnStatus = "출석";
        } else if (resData.exprnSttusSe === 'N') {
            vm.exprnData.exprnStatus = "결석";
        }

    }
    ,getexprnUserStatus: async () => {
        let paramMap = { 'exprnSeq': exprnSeq, 'exprnSn':exprnSn }
        const ExperienceFxParticipantsListRes = await event.sendAjaxRequest("/experience/selectExperienceParticipantsList.api", paramMap);
        await event.setExperienceParticipants(ExperienceFxParticipantsListRes.data);

        const ExperienceUserRes = await event.sendAjaxRequest("/experience/selectExperienceUserList.api", paramMap);
        await event.setExperienceUser(ExperienceUserRes.data);
 

        vm.exprnUserArrayList = ExperienceUserRes.data;
        const {
            exprnSeq, exprnSn, exprnSttusSe, exprnUserSeq, psitnNm, reqstDt, userAuthor,
            userAuthorStr, userInnb, userNm
        } = vm.exprnUserArrayList;
        let experienceUserListResData = ExperienceUserRes.data;
        console.log(ExperienceUserResData)
        await event.setExperienceUser(ExperienceUserResData);  
        console.log(ExperienceUserResData[0].experienceUserCount) 
        console.log(experienceParticipantsResData[0].experienceUserCount)  
        vm.exprnData.exprnParticipantUserCnt = experienceParticipantsResData[0].experienceUserCount
        vm.experienceUserCount = experienceParticipantsResData[0].experienceUserCount + ExperienceUserResData[0].experienceUserCount
    
        vm.exprnData.exprnRegisterCnt = vm.experienceUserCount
        let exprnCancelButtonTag = " <a  id='btnCancelexprn' href='#'  class='btn btn-orange btn-icon btn_search_width' ><span class='text'>체험예약취소</span>  </a>"
    
        let exprnUpdateButtonTag = " <a href='#'  class='btn btn-icon btn-primary btn_search_width'  id='btnUpdateexprn' ><span class='text'>수정</span>  </a>"

        if(vm.experienceUserCount > 0){

            $("#btnCancelexprn").append(exprnCancelButtonTag);
        }else if(vm.experienceUserCount === 0 ){
            $("#btnUpdateexprn").append(exprnUpdateButtonTag);
         //   $("#btnDeleteexprn").append(exprnDeleteButtonTag);
        }
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
        //참여자 상세 이름(기본정보) 노출
        if (resData.length > 0 && resData[0].exprnSeq == vm.exprnData.exprnSeq) {

        } else {
        }

        if (vm.exprnData.exprnDescription || vm.exprnData.canclNtcnArray) {
            let btnCancelExprnElement = document.getElementById('btnCancelExprn');
            btnCancelExprnElement.style.border = '1px solid lightsalmon'; // 예시: 빨간색 경계선
            btnCancelExprnElement.style.backgroundColor = 'lightgray'; // 예시: 회색 배경색
        }


        for (let i = 0; i < resData.length; i++) {
            vm.exprnData.exprnUserArrayUser == resData[i].exprnUserSeq;
            vm.exprnData.studentNameUser == resData[i].userNm;
            vm.exprnData.psitnNmUser == resData[i].psitnNm;
            vm.exprnData.userAuthorUser == resData[i].userAuthor;
            vm.exprnData.studentInnbUser == resData[i].userInnb;
            vm.exprnData.exprnSn == resData[i].exprnSn;
            vm.exprnData.exprnRegisterInfo == resData[i].exprnUserSeq + resData[i].userAuthor + resData[i].userNm + resData[i].psitnNm + resData[i].userInnb;
            let exprnRegisterInfo = resData[i].exprnUserSeq + resData[i].userAuthor + resData[i].userNm + resData[i].psitnNm + resData[i].userInnb


            if (exprnRegisterInfo != '') {
                let exprnRegisterInfoTag = "<div class=' 'input-group' id='' > <div> <span class='dp_center side-by-side' id=''>" + resData[i].userNm + "</span>  <span class='dp_center side-by-side' id=''>" + "(" + resData[i].userInnb + ")" + "</span>" + "/" + "</div></div>"
                $("#boxForUserList").append(exprnRegisterInfoTag);
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
                vm.exprnData.exprnUserArray.push(resData[i].exprnUserSeq + "(" + resData[i].userNm + ")" + "(" + resData[i].psitnNm + ")" + "(" + resData[i].userInnb + ")");
                //기타 수강생 -  FF: 교직원은 사번
            } else if (resData[i].userAuthor === 'FF') {
                vm.exprnData.exprnUserArray.push(resData[i].exprnUserSeq + "(" + resData[i].userNm + ")" + "(" + resData[i].psitnNm + ")" + "(" + resData[i].userInnb + ")");
                //기타 수강생 - ETA: 중고생, ETB : 초등학생은 학교명
            } else if (resData[i].userAuthor === 'ETA' || resData[i].userAuthor === 'ETB') {
                vm.exprnData.exprnUserArray.push(resData[i].exprnUserSeq + "(" + resData[i].userNm + ")" + "(" + resData[i].psitnNm + ")" + "(" + resData[i].userInnb + ")");
                // ETC : 지역주민
            } else if (resData[i].userAuthor === 'ETC') {
                vm.exprnData.exprnUserArray.push(resData[i].exprnUserSeq + "(" + resData[i].userNm + ")" + "(" + resData[i].psitnNm + ")" + "(" + resData[i].userInnb + ")");
                // 기타 수강생 - G: 게스트
            } else if (resData[i].userAuthor === 'G') {
                vm.exprnData.exprnUserArray.push(resData[i].exprnUserSeq + "(" + resData[i].userNm + ")" + "(" + resData[i].psitnNm + ")" + "(" + resData[i].userInnb + ")");
            }
        }

    },
    // 특정 행의 상태를 설정하는 함수
    setStatus: (index, status) => {
        statuses[index] = status;
    },
    setExperienceParticipants: (resData) => {
      
        vm.exprnData.exprnCo !== "" ? exprnCo : 0;
     

        //참여자 상세 이름(기본정보) 노출
        for (let i = 0; i < resData.length; i++) {
            vm.exprnData.exprnParticipantUserArrayUser == resData[i].exprnUserSeq;
            vm.exprnData.studentNameUser == resData[i].userNm;
            vm.exprnData.psitnNmUser == resData[i].psitnNm;
            vm.exprnData.userAuthorUser == resData[i].userAuthor;
            vm.exprnData.studentInnbUser == resData[i].userInnb;
            vm.exprnData.exprnSn == resData[i].exprnSn;
            vm.exprnData.exprnParticipantInfo == resData[i].exprnUserSeq + resData[i].userAuthor + resData[i].userNm + resData[i].psitnNm + resData[i].userInnb;
            let exprnParticipantInfo = resData[i].exprnUserSeq + resData[i].userAuthor + resData[i].userNm + resData[i].psitnNm + resData[i].userInnb


            // ST : 재학생  TJ : 텐진  /순천향대학생, 텐진외대학생의 기본정보는 학번
            if (resData[i].userAuthor === 'ST' || resData[i].userAuthor === 'TJ') {
                vm.exprnData.exprnParticipantUserArray.push(resData[i].exprnUserSeq + "(" + resData[i].userNm + ")" + "(" + resData[i].psitnNm + ")" + "(" + resData[i].userInnb + ")");

                //기타 수강생 -  FF: 교직원은 사번
            } else if (resData[i].userAuthor === 'FF') {
                vm.exprnData.exprnParticipantUserArray.push(resData[i].exprnUserSeq + "(" + resData[i].userNm + ")" + "(" + resData[i].psitnNm + ")" + "(" + resData[i].userInnb + ")");

                //기타 수강생 - ETA: 중고생, ETB : 초등학생은 학교명
            } else if (resData[i].userAuthor === 'ETA' || resData[i].userAuthor === 'ETB') {
                vm.exprnData.exprnParticipantUserArray.push(resData[i].exprnUserSeq + "(" + resData[i].userNm + ")" + "(" + resData[i].psitnNm + ")" + "(" + resData[i].userInnb + ")");
                // ETC : 지역주민
            } else if (resData[i].userAuthor === 'ETC') {
                vm.exprnData.exprnParticipantUserArray.push(resData[i].exprnUserSeq + "(" + resData[i].userNm + ")" + "(" + resData[i].psitnNm + ")" + "(" + resData[i].userInnb + ")");
                // 기타 수강생 - G: 게스트
            } else if (resData[i].userAuthor === 'G') {
                vm.exprnData.exprnUserArray.push(resData[i].exprnUserSeq + "(" + resData[i].userNm + ")" + "(" + resData[i].psitnNm + ")" + "(" + resData[i].userInnb + ")");
            }

        }
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
    event.init();
    vueInit();
    event.getExperienceFxDetail();
    event.getExperienceUserList();

});




