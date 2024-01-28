var vueData = {
    step: "master",
    totalCount: '',
    profsrUserList: {},
    exprnWeekArray: [],
    inputText: '',
    exprnData: {
        exprnWeekArray: [],
        exprnDtArray: [],		//강좌일정
        exprnSeqArray: [],
        exprnBeginTimeArr: [],
        exprnEndTimeArr: [],
        studentMax: 50,
        studentCount: "",
    }, // tb_exprn 
    exprnList: { //fx
        exprnDt: [],   // 샘플'2023-09-11' 
        exprnBeginTimeArr: [],
        exprnEndTimeArr: [],
    },
    searchData: {
        searchText: '',
    },
    getExperienceTime: '',
    userSeq: '',
    exprnFxList: [],
    exprnUserSeq: 0,
    exprnModalList: [],
    exprnDeletedList: [],
    fixedValue: '공자아카데미'
};
const exprnPlaceNm = '공자아카데미'
let dataPerPage = 10;
let pagePerBar = 10;
let pageCount = 10;
let exprnListArray = [];
var vm;
const utils = {
    getGroupedData: (data, key) => {
        const result = {};

        data.forEach(item => {
            if (!result[item[key]]) {
                result[item[key]] = [];
            }

            result[item[key]].push(item);
        });

        return result;
    },
    clearChildren: (elementId) => {
        const element = document.getElementById(elementId);
        if (element && element.hasChildNodes()) {
            while (element.childElementCount) {
                element.removeChild(element.firstElementChild);
            }
        }
    }
}
var vueInit = () => {
    const app = Vue.createApp({
        data() {
            return vueData;
        },
        methods: {

            fnGetExperienceTime: () => {

                vm.exprnList.experienceTimeSetSession = [vm.exprnList.exprnBeginTime, vm.exprnList.exprnEndTime]

                vm.exprnList.exprnBeginTime = vm.exprnList.exprnBeginTimeHour + vm.exprnList.exprnBeginTimeMinutes
                vm.exprnList.exprnEndTime = vm.exprnList.exprnEndTimeHour + vm.exprnList.exprnEndTimeMinutes

                event.plusExperienceTime();
            }
            , fnSave: (data) => {
                vm.exprnData.exprnWeekArray = Object.values(vm.exprnData.exprnWeekArray).sort().join()
                event.getDate()
                vm.exprnData.exprnBeginDe = util.formmater.removeDash(vm.exprnData.exprnBeginDe)
                vm.exprnData.exprnEndDe = util.formmater.removeDash(vm.exprnData.exprnEndDe)
                vm.exprnData.startPeriodDt = (vm.exprnData.startPeriodDt + ' ' + vm.exprnData.startPeriodHour + ':' + vm.exprnData.startPeriodMinute+':' + '00').slice(0, 19)
                vm.exprnData.endPeriodDt = (vm.exprnData.endPeriodDt + ' ' + vm.exprnData.endPeriodHour + ':' + vm.exprnData.endPeriodMinute+':' + '00').slice(0, 19)
                vm.exprnData.exprnCo = vm.exprnData.studentCount

                if (!event.requireValidation()) {
                    return false;
                }

                $.sendAjax({
                    url: "/experience/insertExprn.api",
                    data: vm.exprnData,
                    contentType: "application/json",
                    success: (res) => {
                        $.alert("체험예약이 등록되었습니다. 체험예약 개설 목록으로 이동합니다.", () => {
                            location.href = "experienceList.html";
                        });
                    }
                })

            }
            , fnCancel: () => {
                $.confirm("변경사항을 취소 하시겠습니까?", () => {
                    vm.exprnList = {};
                    vm.exprnData = {};
                    $.alert("변경사항이 취소되었습니다.  체험예약 개설 목록으로 이동합니다.", () => {
                        location.href = "experienceList.html";
                    })
                })
            }
            , fnModalSave: async () => {
                //location.reload();
                let exprnSeq = $("input:radio[name='exprnSeqNum']:checked").attr('id');
                
                let paramMap = { 'exprnSeq': exprnSeq };
                const res = await event.sendAjaxRequest("/experience/selectExprn.api", paramMap);
                await event.setCopyExprn(res.data);

                const exprnFxRes = await event.sendAjaxRequest("/experience/selectExperienceTimeList.api", paramMap);
                await event.setExprnFx(exprnFxRes.data, paramMap);

                const exprnOperateRes = await event.sendAjaxRequest("/experience/selectExprnOperateList.api", paramMap);
                await event.getExpreinceTimeList(exprnOperateRes.data, paramMap);

                $('#ExperienceCopyModal').modal('hide');
            }
            , fnCopyExperience: () => {
                event.detailModal();
            }

            , fnSearch: function (userAuthor) {
                this.searchData.pageNo = 1;
                if (userAuthor !== '') {
                    vm.searchData.authorOne = userAuthor;
                }
                event.detailModal();
            }
            , fnModalCancel: function () {
                $("input:radio[name='exprnSeqNum']").prop('checked', false);
            }
        }
    })
    vm = app.mount('#content');
}
let event = {
    init: () => {
        $(document).on("click", "#deleteExprnTimeHour", function (e) {
            if (e.target.tagName === 'INPUT') {
                e.target.parentElement.remove();
            } else if (e.target.tagName === 'IMG') {
                e.target.parentElement.parentElement.remove();
            }
            //console.log('삭제시도_eventinit');
            event.DeleteExprnTimeHour(e.target);
        })
        event.getDate();
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
    getDate: () => {
        let exprnList = [];

        // exprnBeginDe로 타겟날짜 생성
        const target = new Date(vm.exprnData.exprnBeginDe)
        const exprnEdate = new Date(vm.exprnData.exprnEndDe);
        //console.log(vm.exprnList)
        while (target <= exprnEdate) {
            // 현재 타겟날 추출
            const targetWeekNum = target.getDay()
            let taragetDay = []

            //console.log(new Date(target.setDate(target.getDate())))
            // 현재 타겟날이 주(week)배열(ex ['1', '3'])있을때만 for문 진입입
            if (vm.exprnData.exprnWeekArray.includes(targetWeekNum.toString())) {
                // vm.exprnList.exprnBeginTimeArr 배열개수만큼 생성
                for (let d = 0, i = 0; d < vm.exprnData.exprnWeekArray.split(',').length, i < vm.exprnList.exprnBeginTimeArr.length; i++, d++) {
                    exprnList.push({
                        "exprnDt": util.date.formatDateToYYYYMMDD(target),
                        "exprnBeginTime": vm.exprnList.exprnBeginTimeArr[i],//"1114",
                        "exprnEndTime": vm.exprnList.exprnEndTimeArr[i]//"1415"
                    })
                }
            } else {
                // 주(week)배열아니면 pass
            }


            // 현재 타겟day는 상담마감날까지 1씩증가
            target.setDate(target.getDate() + 1);
        }

        const exprnListSet = [...new Set([...exprnList])]
        //console.log(exprnListSet)
        //const experienceTimeSessions = startTimeSet.map((startTimeSet, index) =>  `${uniqueValues[index]}회 ${startTimeSet}~${endTimeSet[index]}`);

        // idx로 exprnSn 세팅
        exprnList = exprnList.map((exprn, idx) => ({ ...exprn, exprnSn: idx + 1 }))

        vm.exprnData.exprnPlaceNm = exprnPlaceNm
        //console.log(exprnPlaceNm)
        vm.exprnData.exprnList = exprnList
        //console.log(exprnList)

    }
    , requireValidation: () => {
        const validations = [
            // { condition: () => vm.exprnData.exprnBeginDate >= vm.exprnData.rcritEndDate, message: "모집기간 종료일자를 체험 예약 시작일자보다 전 날짜로 잡으세요." },
            { condition: () => vm.exprnData.exprnCo === "", message: "체험생 수를 정해주세요." },
            { condition: () => vm.exprnData.exprnEndDe <= vm.exprnData.exprnBeginDe, message: "체험 예약 종료일자를 체험 예약 시작일자 이후로 정해주세요." },
            { condition: () => vm.exprnData.exprnKndCode === undefined, message: "체험 예약  형태를 선택해주세요." },
            { condition: () => vm.exprnData.exprnPlaceNm === undefined, message: "체험 예약  장소를 입력해주세요." },
            { condition: () => vm.exprnData.studentCount === undefined, message: "체험 예약 생 수를 선택해주세요." },
            { condition: () => vm.exprnData.exprnBeginDe === undefined, message: "체험 예약  기간 시작일자를 입력해주세요." },
            { condition: () => vm.exprnData.exprnEndDe === undefined, message: "체험 예약  기간 종료일자를 입력해주세요." },
            { condition: () => vm.exprnData.exprnWeekArray.length === 0, message: "체험 예약  요일을 선택하세요." },
            { condition: () => vm.exprnList.exprnDt.length < 0, message: "체험 예약  요일이나 기간을 선택하세요." },
            { condition: () => vm.exprnList.exprnBeginTimeHour === undefined, message: "체험 예약  시작 시간을 입력해주세요." },
            { condition: () => vm.exprnList.exprnBeginTimeMinutes === undefined, message: "체험 예약  시작 분을 입력해주세요." },
            { condition: () => vm.exprnList.exprnEndTimeHour === undefined, message: "체험 예약  종료 시간을 입력해주세요." },
            { condition: () => vm.exprnList.exprnEndTimeMinutes === undefined, message: "체험 예약  종료 분을 입력해주세요." },
            { condition: () => vm.exprnList.exprnBeginTimeArr.length <= 0, message: "체험 예약  시간을 추가해주세요" },
            { condition: () => vm.exprnList.exprnEndTimeArr.length <= 0, message: "체험 예약  시작을 추가해주세요" },
            { condition: () => vm.exprnData.startPeriodMinute === undefined, message: "모집기간 시작일자를 입력해주세요." },
            { condition: () => vm.exprnData.endPeriodDt === undefined, message: "모집기간 종료일자를 입력해주세요." },  
            { condition: () => vm.exprnData.startPeriodDt === "", message: "모집기간 시작일자를 입력해주세요." },
            { condition: () => vm.exprnData.endPeriodDt === "", message: "모집기간 종료 일자를 입력해주세요." },

        ];

        for (const validation of validations) {
            if (validation.condition()) {
                $.alert(validation.message);
                return false;
            }
        }
        return true;

    }
    , detailModal: () => {
        $.sendAjax({
            url: "/experience/selectExperienceList.api",
            data: vm.searchData,
            contentType: "application/json",
            success: (res) => {
                $('.CopyExperience').show();

                vm.exprnModalList = res.data.list;

                //console.log(res.data.list)

                for (let i = 0; i < vm.exprnModalList.length; i++) {
                    let modelExprnArrayStr = vm.exprnModalList[i].exprnWeekArray;
                    modelExprnArrayStr = modelExprnArrayStr.replace("1", "월")
                        .replace("2", "화")
                        .replace("3", "수")
                        .replace("4", "목")
                        .replace("5", "금")
                        .replace("6", "토")
                        .replaceAll(",", "/");
                    vm.exprnModalList[i].exprnWeekArray = modelExprnArrayStr;

                }

                fnPaging(res.data.totalCount, dataPerPage, pageCount, res.data.pageNo, (selectPage) => {
                    vm.searchData.pageNo = selectPage;
                    event.detailModal();
                });
            }
            , error: function (e) {
                $.alert(e.responseJSON.message);
            }
        });
    }

    , setCopyExprn: (resData) => {
        //console.log(vm.exprnModalList)
        //console.log(resData)
        vm.exprnData.exprnNm = resData.exprnNm
        vm.exprnData.profsrUserSeq = resData.userNm
        vm.exprnData.exprnWeekArray = resData.exprnWeekArray.split(',');
        vm.exprnData.exprnKndCodeStr = resData.exprnKndCodeStr;							//체험 종류  
        vm.exprnData.exprnKndCode = resData.exprnKndCode;							//체험 종류  
        vm.exprnData.exprnSeq = resData.exprnSeq
        vm.exprnData.startPeriodDt = resData.rcritBeginDt.substring(0, 10);			//모집기간 시작일자
        vm.exprnData.endPeriodDt = resData.rcritEndDt.substring(0, 10);				//모집기간 종료일자	
        vm.exprnData.startPeriodHour = resData.rcritBeginDt.substring(11, 13);		//모집기간 시작시간
        vm.exprnData.startPeriodMinute = resData.rcritBeginDt.substring(14, 16);		//모집기간 시작분
        vm.exprnData.endPeriodHour = resData.rcritEndDt.substring(11, 13);			//모집기간 종료시간
        vm.exprnData.endPeriodMinute = resData.rcritEndDt.substring(14, 16);		//모집기간 종료분  
        vm.exprnData.exprnPlaceNm = resData.exprnPlaceNm;								//상담장소 
        vm.exprnData.studentCount = resData.exprnCo; 								// 체험모집인원 1명-20명 
        vm.exprnList.exprnBeginTimeHour = resData.exprnBeginTimeHour; 								// 
        vm.exprnList.exprnBeginTimeMinutes = resData.exprnBeginTimeMinutes; 								// 
        vm.exprnList.exprnEndTimeHour = resData.exprnEndTimeHour; 								// 
        vm.exprnList.exprnEndTimeMinutes = resData.exprnEndTimeMinutes; 								// 
        vm.exprnData.exprnBeginDe = resData.exprnBeginDate; 								// 
        vm.exprnData.exprnEndDe = resData.exprnEndDate; 								// 

        vm.exprnList.exprnEndTime = vm.exprnList.exprnEndTimeHour + vm.exprnList.exprnEndTimeMinutes
        vm.exprnList.exprnBeginTime = vm.exprnList.exprnBeginTimeHour + vm.exprnList.exprnBeginTimeMinutes
        vm.exprnList.exprnBeginTimeArr.push(vm.exprnList.exprnBeginTime);
        vm.exprnList.exprnEndTimeArr.push(vm.exprnList.exprnEndTime);

        //console.log(vm.exprnList.exprnEndTimeArr)
        let daynum = resData.exprnWeekArray.split(',');// ['3'] 
        let exprnSdate = new Date(vm.exprnData.exprnBeginDe);
        let exprnEdate = new Date(vm.exprnData.exprnEndDe);
        let exprnSeqArray = [];
        let exprnDtArray = [];
        let sortDate = [];

        // 요일변환 numToDay(obj)
        for (var i = 0; i < daynum.length; i++) {
            if (daynum !== "") {

                if (!(exprnSdate instanceof Date && exprnEdate instanceof Date)) return "Not Date Object";
                if (vm.exprnData.exprnSeqArray.includes(exprnSdate.getDay().toString())) {
                    vm.exprnData.exprnDtArray.push(vm.exprnData.exprnSdate);
                }

                while (exprnSdate <= new Date(exprnEdate)) {
                    exprnDtArray.push(exprnSdate.toISOString().split("T")[0]);
                    exprnSeqArray.push(exprnSdate.getDay());  // object result getDay 나타나는 숫자  
                    exprnSdate.setDate(exprnSdate.getDate() + 1);
                }

                for (var t = 0; t < exprnDtArray.length; t++) {
                    if (exprnSeqArray[t] == daynum) {
                        sortDate.push(exprnDtArray[t])
                    }
                    sortDate = vm.exprnList.exprnDt //Object 
                    vm.exprnData.exprnDtArray.push(sortDate);

                }

            }
        }

        var exprnList = []
        for (var t = 0; t < vm.exprnList.exprnDt.length; t++) {
            for (var d = 0; d < vm.exprnList.exprnBeginTimeArr.length; d++) {

                a = {
                    exprnSn: exprnList.length + 1,
                    exprnDt: util.formmater.removeDash(vm.exprnList.exprnDt[t].toString()),
                    exprnBeginTime: vm.exprnList.exprnBeginTimeArr[d],
                    exprnEndTime: vm.exprnList.exprnEndTimeArr[d]
                }
                exprnList.push(a)
                vm.exprnData.exprnList = exprnList
            }
        }

        $('#studentCount').on('change', function (e) {
            $('select option[value=' + resData.exprnCo + ']').attr('selected', 'selected');
        });
        vm.exprnList.exprnTimeContainer = [];
        vm.exprnList.exprnTimeContainerSet = [];
        for (let i = 0; i < vm.exprnList.exprnEndTimeArr.length; i++) {
              //console.log(resData[i])
            vm.exprnList.exprnBeginTimeArr.push = vm.exprnList.exprnBeginTimeArr[i];			//상담 시작 시간 
            vm.exprnList.exprnEndTime = vm.exprnList.exprnEndTimeArr[i];					//상담 종료 시간  
            let exprnTimeSet = util.cnTime(vm.exprnList.exprnBeginTime) + '-' + util.cnTime(vm.exprnList.exprnEndTime)

            vm.exprnList.exprnTimeContainer.push(exprnTimeSet);

        }

        let exprnTimeContainer = new Set(vm.exprnList.exprnTimeContainer)
        let exprnTimeContainerSet = [...exprnTimeContainer];
        for (t = 0; t < exprnTimeContainerSet.length; t++) {
            let experienceTimeSet = exprnTimeContainerSet[t]
            vm.exprnList.exprnTimeContainerSet.push(exprnTimeContainerSet)
            let startTime = vm.exprnList.exprnTimeContainerSet[0][t].split("-")[0].split(' ').join('').replace(/:/g, "")
            let endTime = vm.exprnList.exprnTimeContainerSet[0][t].split("-")[1].split(' ').join('').replace(/:/g, "")
            let experienceTimeSetSession = [startTime, endTime]



        }
        //console.log(vm.exprnList.exprnTimeContainerSet)
    }
    , setExprnFx: (resData, paramMap) => {

        //console.log(resData)
        //console.log(paramMap)
        //console.log(paramMap.exprnSeq)    
        let resObject = resData
        let resDataSn = Object.keys(resData)


    },
    getExpreinceTimeList: (resData) => {
        //console.log(resData)
        let data = Object.values(resData.list).flat()
        //console.log(data)

        const exprnSeq = vm.exprnData.exprnSeq;
        let groupedData = {};

        data.forEach(item => {
            if (!groupedData[item.exprnSeq]) {
                groupedData[item.exprnSeq] = [];
            }
            groupedData[item.exprnSeq].push(item)
        });
        const groupedDataKey = Object.keys(groupedData)
        const groupedDataValue = Object.values(groupedData)
        groupedDataValue.forEach((item, idx) => {
            if (groupedDataKey[idx] === exprnSeq) {
                //console.log(groupedDataKey[idx])

                const result = {
                    exprnSn: [],
                    exprnSn2: [],
                    exprnDt: [],
                    exprnEndTimeArr: [],
                    exprnBeginTimeArr: [],
                    exprnBeginTimeHour: [],
                    exprnBeginTimeMinutes: [],
                    exprnEndTimeHour: [],
                    exprnEndTimeMinutes: []
                };

                groupedDataValue[idx].forEach(item => {
                    result.exprnSn.push(result.exprnBeginTimeArr.length + 1)
                    result.exprnSn2.push(item.exprnSn)
                    result.exprnDt.push(item.exprnDate);
                    result.exprnBeginTimeHour.push(item.exprnBeginTimeHour)
                    result.exprnBeginTimeMinutes.push(item.exprnBeginTimeMinutes)
                    result.exprnEndTimeHour.push(item.exprnEndTimeHour)
                    result.exprnEndTimeMinutes.push(item.exprnEndTimeMinutes)
                    result.exprnBeginTimeArr.push(item.exprnBeginTimeHour + item.exprnBeginTimeMinutes)
                    result.exprnEndTimeArr.push(item.exprnEndTimeHour + item.exprnEndTimeMinutes)
                });
                const resultArray = [result];
                //console.log(resultArray)
                vm.exprnList = resultArray[0]
            }
            const exprnList = [];
            exprnList.push({
                exprnSn: vm.exprnList.exprnSn,
                exprnDt: vm.exprnList.exprnDt,
                exprnBeginTime: vm.exprnList.exprnBeginTimeArr,
                exprnBeginTimeHour: vm.exprnList.exprnBeginTimeHour,
                exprnBeginTimeMinutes: vm.exprnList.exprnBeginTimeMinutes,
                exprnEndTimeHour: vm.exprnList.exprnEndTimeHour,
                exprnEndTimeMinutes: vm.exprnList.exprnEndTimeMinutes
            })
            //console.log(exprnList)
            //console.log(vm.exprnList.exprnSn)
            vm.exprnList.exprnBeginTimeArr = [...new Set([...vm.exprnList.exprnBeginTimeArr])]
            vm.exprnList.exprnEndTimeArr = [...new Set([...vm.exprnList.exprnEndTimeArr])]
            vm.exprnList.exprnDt = [...new Set([...vm.exprnList.exprnDt])]
            const exprnSnLength = parseInt(vm.exprnList.exprnBeginTimeArr.length) * parseInt(vm.exprnList.exprnDt.length);
            const exprnSnArr = [];
            for (let i = 1; i <= exprnSnLength; i++) {
                exprnSnArr.push(i)
            }
            vm.exprnList.exprnSn2 = exprnSnArr
            //console.log(vm.exprnList)
        })
        const startTimeSet = [...new Set([...vm.exprnList.exprnBeginTimeArr])]
        const endTimeSet = [...new Set([...vm.exprnList.exprnEndTimeArr])]
        const uniqueValues = [...new Set([...vm.exprnList.exprnSn])]

        const dateSet = [...new Set([...vm.exprnList.exprnDt])]
        const experienceTimeSessions = startTimeSet.map((startTimeSet, index) =>
            `${uniqueValues[index]}회 ${startTimeSet}~${endTimeSet[index]}`
        );

        utils.clearChildren('getExperienceSnTime2');
        const experienceTimeSessionTag = experienceTimeSessions.map((experienceTimeSession, idx) => `<div class='exprnTimeHourTag db_center' id='exprnTimeTag + ${idx + 1}' style='white-space:nowrap; text-wrap:nowrap;'>${experienceTimeSession}<button id='deleteExprnTimeHour' type='button' name='${idx + 1}' @click="fndeleteExprnTimeHour"><img src='/image/close.png' alt='${startTimeSet}&${endTimeSet}'  id='${vm.exprnList.exprnDt}' name='${idx}' class='delete-keyword-btn '/> </button></div>`);

        $("#getExperienceSnTime").append(experienceTimeSessionTag)
        //console.log(experienceTimeSessionTag)
        //console.log(startTimeSet)
    }
    , DeleteExprnTimeHour: (target) => {
        //console.log('삭제시도')
        //console.log(target)
        const idexprndt = target.id.split(',');
        const deletedExprndt = [...new Set(Object.values(idexprndt))]
        const idx = target.name
        //console.log(deletedExprndt)
        if (target.tagName === 'IMG') {
            const altTimeValue = target.alt.split('&');
            const startTimeSet = altTimeValue[0].split(',')
            const endTimeSet = altTimeValue[1].split(',')
            //const snfilter = vm.exprnList.exprnSn.reduce((acc, num) => {  if (!acc.includes(num)) acc.push(num); return acc  }, []);
            //console.log(snfilter)
            //console.log(startTimeSet)
            //console.log(endTimeSet)
            const deletedDt = deletedExprndt[idx]
         
            const deletedStartTime = startTimeSet[idx] !== undefined ? startTimeSet[idx] : startTimeSet.toString()
            const deletedEndTime = endTimeSet[idx] !== undefined ? endTimeSet[idx] : endTimeSet.toString()
            //console.log(deletedDt)
            //console.log(deletedStartTime)
            //console.log(deletedEndTime)
            var index = startTimeSet.indexOf(deletedStartTime);
            const deletedSn = parseInt(index) + 1
            //console.log(index)
            //console.log(deletedSn)
            vm.exprnList.deletedStartTime = deletedStartTime
            vm.exprnList.deletedEndTime = deletedEndTime
            vm.exprnList.deletedSn = deletedSn
            const resultArray3 = [];
             // 만약 복사 모달창에서 가져온 값이 아니라면 값이 undefined 나온다. 그럴때 사용할수 있는 값을 찾아야한다. 

            const dataLength = vm.exprnList.exprnSn !== undefined ? vm.exprnList.exprnSn.length : vm.exprnList.exprnBeginTimeArr.length;
            //console.log(dataLength)
            for (let i = 0; i <= dataLength; i++) {
                resultArray3.push({
                    "deletedDt": vm.exprnList.exprnDt,
                    "deletedStartTime": vm.exprnList.deletedStartTime,
                    "deletedEndTime": vm.exprnList.deletedEndTime
                });
            }
            vm.exprnDeletedList.push(resultArray3)
            //console.log(vm.resultArray3)
            //console.log(vm.exprnDeletedList)
            // getDeletedTimeSet에서 받은 deleted값을 변형해준다.

            vm.exprnList.exprnBeginTimeArr = vm.exprnList.exprnBeginTimeArr.filter(time => time !== deletedStartTime)
            vm.exprnList.exprnEndTimeArr = vm.exprnList.exprnEndTimeArr.filter(time => time !== deletedEndTime)
            //console.log(Array.from(new Set(vm.exprnList.reExprnDt)))
            //console.log(vm.exprnList)
        }


    }
    , plusExperienceTime: (e) => {
        //console.log(vm.exprnList)
        SetSession = [vm.exprnList.exprnBeginTime, vm.exprnList.exprnEndTime]

        let exprnBeginTime = vm.exprnList.exprnBeginTimeHour + vm.exprnList.exprnBeginTimeMinutes
        let exprnEndTime = vm.exprnList.exprnEndTimeHour + vm.exprnList.exprnEndTimeMinutes

        vm.exprnList.exprnBeginTime = exprnBeginTime
        vm.exprnList.exprnEndTime = exprnEndTime
        //console.log(`exprnBeginTime ${exprnBeginTime}` + `exprnEndTime ${exprnEndTime}`)
        vm.exprnList.experienceTimeSetSession = [vm.exprnList.exprnBeginTime, vm.exprnList.exprnEndTime]

        const exprnSnLength = parseInt(vm.exprnList.exprnBeginTimeArr.length);
        const exprnSnArr = [];
        for (let i = 1; i <= exprnSnLength; i++) {
            exprnSnArr.push(i)
        }
        //console.log(exprnSnArr)
        const startTimeSet = [...new Set([...vm.exprnList.exprnBeginTimeArr])]
        const endTimeSet = [...new Set([...vm.exprnList.exprnEndTimeArr])]
        const uniqueValues = exprnSnArr
        const experienceTimeSessions = startTimeSet.map((startTimeSet, index) =>
            `${uniqueValues[index]}회 ${startTimeSet}~${endTimeSet[index]}`
        );
        const experienceTimeSessionTag = `<div class='exprnTimeHourTag db_center' id='exprnTimeTag' style='white-space:nowrap; text-wrap:nowrap;'>${exprnBeginTime}` + '~' + `${exprnEndTime}<button id='deleteExprnTimeHour' type='button' @click="fndeleteExprnTimeHour"><img src='/image/close.png' alt='${exprnBeginTime}&${exprnEndTime}'  id='${vm.exprnList.exprnDt}'  class='delete-keyword-btn '/> </button></div>`


        $("#getExperienceSnTime").append(experienceTimeSessionTag)
        vm.exprnList.exprnBeginTimeArr.push(vm.exprnList.exprnBeginTime);
        vm.exprnList.exprnEndTimeArr.push(vm.exprnList.exprnEndTime);
    }

};

var datepicker = function () {
    $.datepicker.setDefaults({
        dateFormat: "yy-mm-dd",
        yearSuffix: "년",
        monthNames: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
        monthNamesShort: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
        dayNamesMin: ["일", "월", "화", "수", "목", "금", "토"],
        showOtherMonths: true,
        showMonthAfterYear: true,
        changeMonth: true,
        changeYear: true,
        nextText: "다음 달",
        prevText: "이전 달",
        viewMode: "months",
        minViewMode: "months",
    });
    $(".datepicker")
        .datepicker()
        .on("change", function () {
            this.dispatchEvent(new Event("input"));
            if ($(this).hasClass("datepicker_from")) {
                $(this).closest(".bx_calendar").find(".datepicker_to").datepicker("option", "minDate", this.value);
            } else if ($(this).hasClass("datepicker_to")) {
                $(this).closest(".bx_calendar").find(".datepicker_from").datepicker("option", "maxDate", this.value);
            }
        });
};

$(document).ready(() => {
    vueInit();
    event.init();
    datepicker();
    //datepicker달력에 화면 깨지는 것 설정 변경
    $.datepicker.setDefaults({
        changeMonth: false,
        changeYear: false,
    });
    /* 상담 기간는 현재 일자 이후로 선택 가능 */
    $("#datepickerFromexprn").datepicker("option", "minDate", util.date.addDateDash(util.date.getToday()));
    $("#datepickerToexprn").datepicker("option", "minDate", util.date.addDateDash(util.date.getToday()));
    /* 모집기간 시작일자, 종료일자는 현재 일자 이후로 선택 가능 */
    $("#startPeriodDt").datepicker("option", "minDate", util.date.addDateDash(util.date.getToday()));
    $("#endPeriodDt").datepicker("option", "minDate", util.date.addDateDash(util.date.getToday()));
})



