var vueData = {
    cnsltDetail: {
        startHour: "",				// 시작 시간
        startMinute: "",			// 시작 분
        endHour: "",				// 종료 시간
        endMinute: "",				// 종료 분
        startDt: "",				// 기간 시작일자
        endDt: "",					// 기간 종료일자
        startPeriodDt: "",			//	모집기간 시작일자
        endPeriodDt: "",			//	모집기간 종료일자
        startPeriodHour: "",		//	모집기간 시작시간
        startPeriodMinute: "",		//	모집기간 시작분
        endPeriodHour: "",			//	모집기간 종료시간
        endPeriodMinute: "",		//	모집기간 종료분 
        profsrName: "",				//	교수명
        profsrUserSeq: "",	//	교수이용자일련 -> 회원검색 팝업 생기면 이 부분 수정하기 

        cnsltWeekArray: [],			//	요일
        cnsltPlace: "",				//	장소   
    },
    preview: "",
    searchData: {
        searchText: '',
        canceldCnsltInclude: '',
    },
    canceldCnsltInclude: '',
    cnsltSeqPer: ""
};

let vm;

const urlParams = new URL(location.href).searchParams;
const cnsltSeq = urlParams.get('cnsltSeq');
const cnsltSn = urlParams.get('cnsltSn');
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

        $(document).on("click", "#btnDeleteCnslt", function (e) { 
            let paramMap = { 'cnsltSeq': cnsltSeq };
            $.confirm("정말 삭제하시겠습니까? 자료가 모두 사라집니다.", () => {
                $.sendAjax({
                    url: "/consult/deleteCnsltOne.api",
                    data: paramMap,
                    contentType: "application/json",
                    success: (res) => {
                        let resData = res.data;
                        $.alert("입력한 내용이 모두 삭제되었습니다.", () => {
                            location.href = "consultList.html";
                        });
                    },
                    error: function (e) {
                        $.alert(e.responseJSON.message);
                    },
                });
            });
        });

        $(document).on("click", "#btnUpdateCnslt", function (e) {
            location.href = "consultUpdt.html?cnsltSeq=" + cnsltSeq;

        });
    }
    , getConsultDetail: () => { 
        let paramMap = { 'cnsltSeq': cnsltSeq };
        $.sendAjax({
            url: "/consult/selectConsultDetail.api",
            data: paramMap,
            contentType: "application/json",
            success: async (res) => {
                let resData = res.data; 
                await event.setConsultDetail(resData);

            }
            , error: function (e) {
                $.alert(e.responseJSON.message);
            },
        });
    }

    , setConsultDetail: (resData) => {
        let tempCnslteWeekArray = resData.cnsltWeekArray.split(',')
        for (let i = 0; i < tempCnslteWeekArray.length; i++) {
            let dayValue = tempCnslteWeekArray[i];

            if (dayValue == $(".cnsltDayArray").prop("checked").value) {
                $(".cnsltDayArray")[i].attr("checked", true);
            }
        }

        vm.cnsltDetail.rcritBeginDate = resData.rcritBeginDate;
        vm.cnsltDetail.rcritBeginHour = resData.rcritBeginHour;
        vm.cnsltDetail.rcritBeginMinutes = resData.rcritBeginMinutes;
        vm.cnsltDetail.rcritEndDate = resData.rcritEndDate;
        vm.cnsltDetail.rcritEndHour = resData.rcritEndHour;
        vm.cnsltDetail.rcritEndMinutes = resData.rcritEndMinutes;
        vm.cnsltDetail.userNm = resData.userNm
        vm.cnsltDetail.cnsltSeStr = resData.cnsltSeStr
        vm.cnsltDetail.cnsltPlaceNm = resData.cnsltPlaceNm
        vm.cnsltDetail.cnsltCo = resData.cnsltCo
        vm.cnsltDetail.cnsltPlaceNm = resData.cnsltPlaceNm
        vm.cnsltDetail.rcritBeginDt = resData.rcritBeginDt
        vm.cnsltDetail.rcritEndDt = resData.rcritEndDt
        vm.cnsltDetail.cnsltBeginDate = resData.cnsltBeginDate
        vm.cnsltDetail.cnsltEndDate = resData.cnsltEndDate
        vm.cnsltDetail.cnsltBeginTimeHour = resData.cnsltBeginTimeHour
        vm.cnsltDetail.cnsltBeginTimeMinutes = resData.cnsltBeginTimeMinutes
        vm.cnsltDetail.cnsltEndTimeHour = resData.cnsltEndTimeHour
        vm.cnsltDetail.cnsltEndTimeMinutes = resData.cnsltEndTimeMinutes
        vm.cnsltDetail.cnsltWeekArray = resData.cnsltWeekArray.split(',')
        vm.cnsltDetail.cnsltNm = resData.cnsltNm

    }
    , getConsultTimeList: () => {
        $.sendAjax({
            url: "/consult/selectCnsltOperateList.api",
            data: vm.searchData,
            contentType: "application/json",
            success: async (res) => {
                vm.cnsltList = res.data;
                let resData = res.data;


                await event.setConsultTimeList(resData);

            }
            , error: function (e) {
                $.alert(e.responseJSON.message);
            }
        });
    }
    , setConsultTimeList: (resData) => {
         let resDataSn = Object.keys(resData.list)
        let data = Object.values(resData.list).flat(); // 객체의 모든 값을 하나의 배열로 합칩니다.

        vm.cnsltSeqPer = cnsltSeq
        let groupedData = {};
        // cnsltSeq 값을 기준으로 객체를 묶기.
        data.forEach(item => {
            if (!groupedData[item.cnsltSeq]) {
                groupedData[item.cnsltSeq] = [];
            }

            groupedData[item.cnsltSeq].push(item)
        });

        let groupedDataKey = Object.keys(groupedData)

        let groupedBeginTimeHourData = {};
        let groupedPerData = {};
        for (var k = 0; k < Object.keys(groupedData).length; k++) {

            if (cnsltSeq == Object.keys(groupedData)[k]) {
                //	console.log(k)  그룹화된 전체 array에서 cnsltSeq의 값에 맞는 idx
                let groupedDataSize = Object.values(groupedData)[k].length
                let ttt = Object.values(groupedData)[k]
                let dataGrouped = ttt.flat();

                // cnsltSeq 값을 기준으로 객체를 묶기.
                dataGrouped.forEach(item => {
                    let itemStartTime = item.cnsltBeginTimeHour + ':' + item.cnsltBeginTimeMinutes + '~' + item.cnsltEndTimeHour + item.cnsltEndTimeMinutes
                    if (!groupedPerData[itemStartTime]) {
                        groupedPerData[itemStartTime] = [];
                    }
                    groupedPerData[itemStartTime].push(item)
                });
                let groupedPerDataKey = Object.keys(groupedPerData)
                let grupedPerTimeValue = Object.values(groupedPerData)
                for (var g = 0; g < grupedPerTimeValue.length; g++) {
                    let timeSnStart = Object.values(groupedData)[k][g].cnsltBeginTimeHour + ':' + Object.values(groupedData)[k][g].cnsltBeginTimeMinutes
                    let timeSnEnd = Object.values(groupedData)[k][g].cnsltEndTimeHour + ':' + Object.values(groupedData)[k][g].cnsltEndTimeMinutes
                    let timeSnSet = timeSnStart + ' ~ ' + timeSnEnd

                    let getConsultSnTimeTag = "<div  style='display:flex;'>" + "<div>" + Object.values(groupedData)[k][g].cnsltSn + '회' + '\n' + "&nbsp&nbsp&nbsp&nbsp" + "</div>" + '\n' + "&nbsp&nbsp&nbsp&nbsp" + "<div class=''>" + timeSnSet + "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp" + " </div>";

                    $("#getConsultSnTime").append(getConsultSnTimeTag);
                }

            }
        }
        let sortedData = Object.values(groupedData).map(group => {
            return group.sort((a, b) => new Date(a.cnsltDate) - new Date(b.cnsltDate));
        })


        for (var s = 0; s < sortedData.length; s++) {


            let sortedDataPerSize = sortedData[s].length
        }



        for (i = 0; i < resData.length; i++) {

            if (cnsltSeq == resData[i].cnsltSeq) {
                var targetIndex = -1;
                var targetValue = cnsltSeq
                for (s = 0; s < resDataSn.length; s++) {
                    if (resObject[resDataSn[s]].cnsltSeq == targetValue) {
                        targetIndex = s
                        break;
                    }
                }
            }
        }
    }
    , getConsultFxDetail: () => {
        let urlParams = new URL(location.href).searchParams;
        let cnsltSeq = urlParams.get('cnsltSeq');
        let paramMap = { 'cnsltSeq': cnsltSeq };

        $.sendAjax({
            url: "/consult/selectConsultRegistranter.api",
            data: paramMap,
            contentType: "application/json",
            success: async (res) => {
                let resData = res.data;
                vm.consultUser = res.data
                await event.setConsultParticipants(res.data);

            },
            error: function (e) {
                $.alert(e.responseJSON.message);
            },
        });
    }
    , setConsultParticipants: (resData) => {
        if (resData.consultUserCount == 0) {


            let CnsltCancelButtonTag = "<a href='#' class='btn btn-icon btn-google btn_search_width' id='btnDeleteCnslt'><span class='text'>삭제</span>  </a>"
            let CnsltUpdateButtonTag = " <a href='#'  class='btn btn-icon btn-primary btn_search_width'  id='btnUpdateCnslt' ><span class='text'>수정</span>  </a>"
            $("#btnUpdateCnslt").append(CnsltUpdateButtonTag);
            $("#btnDeleteCnslt").append(CnsltCancelButtonTag);

        } else if (resData.consultUserCount != 0) {

        }

    }



};

$(document).ready(() => {
    vueInit();;
    event.init();
    event.getConsultDetail();
    event.getConsultTimeList();
    event.getConsultFxDetail();

});




