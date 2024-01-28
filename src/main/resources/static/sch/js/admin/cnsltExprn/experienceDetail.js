var vueData = {
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
    searchData: {
        searchText: '',
    },
    exprnSeqPer: "",
    exprnUser: []
};

let vm;

const urlParams = new URL(location.href).searchParams;
const exprnSeq = urlParams.get('exprnSeq'); 
var vueInit = () => {
    const app = Vue.createApp({
        data() {
            return vueData;
        },
        methods: { 
            fnExprnUpdt : () => {
            
            } 
        }
    })
    vm = app.mount('#content');
}

let event = {
    init: () => {

        $(document).on("click", "#btnDeleteExprn", function (e) {  
            let paramMap = {'exprnSeq':exprnSeq};
            $.confirm("정말 삭제하시겠습니까? 자료가 모두 사라집니다.", ()=>{
                $.sendAjax({
                    url : "/experience/deleteExprnOne.api",
                    data : paramMap,
                    contentType : "application/json",
                    success : (res) =>{
                        let resData = res.data;
                        $.alert("입력한 내용이 모두 삭제되었습니다.", ()=>{
                            location.href = "experienceList.html";
                        });                        
                    },
                    error : function(e){
                        $.alert(e.responseJSON.message);
                    },
                });
            });
        });

        $(document).on("click", "#btnUpdateExprn", function (e) {
         
            location.assign("/sch/admin/cnsltExprn/experienceUpdt.html?exprnSeq=" + exprnSeq) 

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
    getExperienceDetail: async () => {
        let paramMap = { 'exprnSeq': exprnSeq };

        const ExperienceDetailRes = await event.sendAjaxRequest("/experience/selectExperienceDetail.api", paramMap);
        await event.setExperienceDetail(ExperienceDetailRes.data);

    }

    , setExperienceDetail: (resData) => {
        //console.log(resData)
        let tempExprneWeekArray = resData.exprnWeekArray.split(',')
        for (let i = 0; i < tempExprneWeekArray.length; i++) {
            let dayValue = tempExprneWeekArray[i];
            //console.log(dayValue)    
            if (dayValue == $(".exprnDayArray").prop("checked").value) {
                $(".exprnDayArray")[i].attr("checked", true);
            }
        }

        vm.exprnDetail.rcritBeginDate = resData.rcritBeginDate
        vm.exprnDetail.rcritBeginHour = resData.rcritBeginHour
        vm.exprnDetail.rcritBeginMinutes = resData.rcritBeginMinutes
        vm.exprnDetail.rcritEndDate = resData.rcritEndDate
        vm.exprnDetail.rcritEndHour = resData.rcritEndHour
        vm.exprnDetail.rcritEndMinutes = resData.rcritEndMinutes
        vm.exprnDetail.rcritBeginDt = resData.rcritBeginDt
        vm.exprnDetail.rcritEndDt = resData.rcritEndDt
        vm.exprnDetail.exprnBeginDate = resData.exprnBeginDate
        vm.exprnDetail.exprnBeginTimeHour = resData.exprnBeginTimeHour
        vm.exprnDetail.exprnBeginTimeMinutes = resData.exprnBeginTimeMinutes
        vm.exprnDetail.exprnEndDate = resData.exprnEndDate
        vm.exprnDetail.exprnEndTimeMinutes = resData.exprnEndTimeMinutes
        vm.exprnDetail.exprnEndTimeHour = resData.exprnEndTimeHour
        vm.exprnDetail.userNm = resData.userNm
        vm.exprnDetail.exprnKndCodeStr = resData.exprnKndCode
        vm.exprnDetail.exprnKndCodeStr = resData.exprnKndCodeStr
        vm.exprnDetail.exprnPlaceNm = resData.exprnPlaceNm
        vm.exprnDetail.exprnCo = resData.exprnCo
        vm.exprnDetail.exprnWeekArray = resData.exprnWeekArray.split(',')
        vm.exprnDetail.exprnNm = resData.exprnNm

    }
    , getExperienceTimeList: async () => {
        let paramMap = { 'exprnSeq': exprnSeq };
        const ExperienceTimeListRes = await event.sendAjaxRequest("/experience/selectExprnOperateList.api", paramMap);
        await event.setExperienceTimeList(ExperienceTimeListRes.data);

    }
    , setExperienceTimeList: (resData) => {
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

            //      console.log(item)
            groupedData[item.exprnSeq].push(item)
        });


        let groupedPerData = {};
        for (var k = 0; k < Object.keys(groupedData).length; k++) {

            if (exprnSeq == Object.keys(groupedData)[k]) {
                //console.log(k)  그룹화된 전체 array에서 exprnSeq의 값에 맞는 idx ex) Object.keys(groupedData)[k] = EXPRN_00000067
                // console.log(Object.values(groupedData)[k])

                let ttt = Object.values(groupedData)[k]
                let dataGrouped = ttt.flat();
                vm.exprnUser = dataGrouped
                // cnsltSeq 값을 기준으로 객체를 묶기.
                dataGrouped.forEach(item => {
                    let itemStartTime = item.exprnBeginTimeHour + ':' + item.exprnBeginTimeMinutes + '~' + item.exprnEndTimeHour + item.exprnEndTimeMinutes
                    if (!groupedPerData[itemStartTime]) {
                        groupedPerData[itemStartTime] = [];
                    }
                    groupedPerData[itemStartTime].push(item)
                });

                let grupedPerTimeValue = Object.values(groupedPerData)
                for (var g = 0; g < grupedPerTimeValue.length; g++) {
                    //console.log(Object.values(groupedData)[k][g].exprnBeginTimeHour)
                    let timeSnStart = Object.values(groupedData)[k][g].exprnBeginTimeHour + ':' + Object.values(groupedData)[k][g].exprnBeginTimeMinutes
                    let timeSnEnd = Object.values(groupedData)[k][g].exprnEndTimeHour + ':' + Object.values(groupedData)[k][g].exprnEndTimeMinutes
                    let timeSnSet = timeSnStart + ' ~ ' + timeSnEnd
                    let timeSn = Object.values(groupedData)[k][g].exprnSn

                    let getExperienceSnTimeTag = "<div  style='display:flex;'>" + "<div>" + timeSn + '회' + '\n' + "&nbsp&nbsp&nbsp&nbsp" + "</div>" + '\n' + "&nbsp&nbsp&nbsp&nbsp" + "<div class=''>" + timeSnSet + "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp" + " </div>";

                    $("#getExperienceSnTime").append(getExperienceSnTimeTag);
                }

            }
        }
    }
    , getExperienceFxDetail: async () => {
        let paramMap = { 'exprnSeq': exprnSeq };
        const ExperienceFxDetailRes = await event.sendAjaxRequest("/experience/selectExperienceParticipantsList.api", paramMap);
        await event.setExperienceParticipants(ExperienceFxDetailRes.data); 
        let resData = ExperienceFxDetailRes.data; 
        console.log(resData)  
        vm.exprienceUser = ExperienceFxDetailRes.data
    }
    , setExperienceParticipants: (resData) => { 
       
        console.log(resData[0].experienceUserCount)  

        if (resData[0].experienceUserCount == 0) {
            let ExprnCancelButtonTag = "<a href='#' class='btn btn-google btn-icon btn_search_width' id='btnDeleteExprn'><span class='text' >삭제</span>  </a>"
            let ExprnUpdateButtonTag = "<a href='#'  class='btn btn-icon btn-primary btn_search_width'  id='btnUpdateExprn'  ><span class='text'>수정</span>  </a>"
            $("#btnDeleteExprn").append(ExprnCancelButtonTag);
            $("#btnUpdateExprn").append(ExprnUpdateButtonTag);

        } else if (resData[0].experienceUserCount != 0) {

            console.log('목록만 보이게 한다. ') 
        }

    }
 
};




$(document).ready(() => {
    vueInit();
    event.init();
    event.getExperienceDetail();
    event.getExperienceTimeList();
    event.getExperienceFxDetail();

});




