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
    exprnUser: {
        studentMax: 50,
        studentCount: "",
    },
    getExperienceTime: '',
    userSeq: '',
    exprnFxList: [],
    exprnUserSeq: 0,
    exprnModalList: [],
    exprnDeletedList : [],
    fixedValue: '공자아카데미'
}; 
const exprnPlaceNm = '공자아카데미'
const urlParams = new URL(location.href).searchParams;
const exprnSeq = urlParams.get('exprnSeq');
const paramMap = { 'exprnSeq': exprnSeq };

let dataPerPage = 10;
let pagePerBar = 10;
let pageCount = 10;

let exprnListArray = [];
let vm;
let timeCount = 0;  // 이 변수는 버튼을 클릭할 때마다 증가합니다.

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

            fnselectExprnCode: () => {
                $(document).on("click", "#exprnCode", function (e) {
                    if (vm.exprnData.exprnKndCode == 'EXPRN_KND_CODE_1') {
                        vm.exprnData.exprnKndCodeStr = '차 체험'
                        $("#exprnCode").val("EXPRN_KND_CODE_1").prop("selected", true);
                        $("#exprnCode").attr("disabled", true);
                    } else if (vm.exprnData.exprnKndCode == 'EXPRN_KND_CODE_2') {
                        vm.exprnData.exprnKndCodeStr = '서예 체험'
                        $("#exprnCode").val("EXPRN_KND_CODE_1").prop("selected", true);
                        $("#exprnCode").attr("disabled", true);
                    }else if (vm.exprnData.exprnKndCode == 'EXPRN_KND_CODE_3') {
                        vm.exprnData.exprnKndCodeStr = '도장 체험'
                        $("#exprnCode").val("EXPRN_KND_CODE_3").prop("selected", true);
                        $("#exprnCode").attr("disabled", true);
                    }else if (vm.exprnData.exprnKndCode == 'EXPRN_KND_CODE_4') {
                        vm.exprnData.exprnKndCodeStr = '향 체험'
                        $("#exprnCode").val("EXPRN_KND_CODE_4").prop("selected", true);
                        $("#exprnCode").attr("disabled", true);
                    }
                })
            },
            fnGetExperienceTime: () => {

                vm.exprnList.experienceGetTimeArr = []
                vm.exprnList.experienceGetBeginTimeArr = []
                vm.exprnList.experienceGetEndTimeArr = []
                let timeArr = []
                vm.exprnList.experienceTimeSetSession = [vm.exprnList.exprnBeginTime, vm.exprnList.exprnEndTime]
                // 버튼 요소와 클릭 횟수를 나타낼 요소를 가져옴
                let clickButton = document.getElementById('experienceTimebutton');
                let clickCountElement = document.getElementById('clickCount');
                // 클릭 횟수를 저장할 변수를 초기화
                vm.exprnList.exprnBeginTime = vm.exprnList.exprnBeginTimeHour + vm.exprnList.exprnBeginTimeMinutes
                vm.exprnList.exprnEndTime = vm.exprnList.exprnEndTimeHour + vm.exprnList.exprnEndTimeMinutes

                event.plusExperienceTime();
            }
            , fnSave: async (data) => {
                vm.exprnData.exprnWeekArray = Object.values(vm.exprnData.exprnWeekArray).sort().join()
                event.getDate()
                vm.exprnData.exprnBeginDe = util.formmater.removeDash(vm.exprnData.exprnBeginDe)
                vm.exprnData.exprnEndDe = util.formmater.removeDash(vm.exprnData.exprnEndDe)
                vm.exprnData.startPeriodDt = (vm.exprnData.startPeriodDt + ' ' + vm.exprnData.startPeriodHour + ':' + vm.exprnData.startPeriodMinute).slice(0, 19)
                vm.exprnData.endPeriodDt = (vm.exprnData.endPeriodDt + ' ' + vm.exprnData.endPeriodHour + ':' + vm.exprnData.endPeriodMinute).slice(0, 19)
                vm.exprnData.exprnCo = vm.exprnData.studentCount

                //필수 입력 validation
                if (!event.requireValidation()) {
                    return false;
                } 
                $.sendAjax({
                    url: "/experience/updateExprn.api",
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
                    $.alert("취소되었습니다.  목록으로 이동합니다.", () => {
                        location.href = "experienceList.html";
                    })
                })
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
            //console.log('삭제시도');
            event.DeleteExprnTimeHour(e.target);
        })
         
        event.getDate()
    } 
    , requireValidation: () => {
        const validations = [
            // { condition: () => vm.exprnData.exprnBeginDate >= vm.exprnData.rcritEndDate, message: "모집기간 종료일자를 체험 예약 시작일자보다 전 날짜로 잡으세요." },
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
            { condition: () => vm.exprnList.exprnBeginTimeArr.length === 0, message: "체험 예약  시간을 추가해주세요" },
            { condition: () => vm.exprnList.exprnEndTimeArr.length === 0, message: "체험 예약  시작을 추가해주세요" },
            { condition: () => vm.exprnData.startPeriodMinute === undefined, message: "모집기간 시작일자를 입력해주세요." },
         //   { condition: () => vm.exprnData.endPeriodDt === undefined, message: "모집기간 종료일자를 입력해주세요." },
          //  { condition: () => vm.exprnData.endPeriodDt === undefined, message: "모집기간 종료 일자를 입력해주세요." },  
          //{ condition: () => vm.exprnData.startPeriodDt === "", message: "모집기간 시작일자를 입력해주세요." },
           // { condition: () => vm.exprnData.endPeriodDt === "", message: "모집기간 종료 일자를 입력해주세요." } 
        ];

        for (const validation of validations) {
            if (validation.condition()) {
                $.alert(validation.message);
                return false;
            }
        }
        return true;

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
        const target = new Date(vm.exprnData.exprnBeginDe);
        const exprnEdate = new Date(vm.exprnData.exprnEndDe);

        while (target <= exprnEdate) {

            const targetWeekNum = target.getDay()

            if (vm.exprnData.exprnWeekArray.includes(targetWeekNum.toString())) {
                for (let d = 0, i = 0; d < vm.exprnData.exprnWeekArray.split(',').length, i < vm.exprnList.exprnBeginTimeArr.length; i++, d++) {
                    exprnList.push({
                        "exprnDt": util.date.formatDateToYYYYMMDD(target),
                        "exprnBeginTime": vm.exprnList.exprnBeginTimeArr[i],
                        "exprnEndTime": vm.exprnList.exprnEndTimeArr[i]
                    })
                }
            } else {
                // 주 배열이 아니면 pass
            }
            // 현재 타겟day는 체험마감날까지 1씩 증가
            target.setDate(target.getDate() + 1);
        }

        // idx로 exprnSn세팅
        exprnList = exprnList.map((exprn, idx) => ({ ...exprn, exprnSn: idx + 1 }))

        vm.exprnData.exprnList = exprnList
        console.log(exprnList)
    },
     getExperienceDetail: async () => {
        // 현재 페이지의 URL을 가져오기
        var currentUrl = window.location.href;

        // URL을 '&'로 나눠서 파라미터들을 배열로 저장
        var urlParams = currentUrl.split('&');

        var exprnSeqValue;

        for (var i = 0; i < urlParams.length; i++) {
            if (urlParams[i].indexOf('exprnSeq=') !== -1) {
                exprnSeqValue = urlParams[i].split('=')[1];
                break;
            }
        }

        // 추출된 exprnSeqValue 값을 확인
        console.log('exprnSeqValue 값:', exprnSeqValue);
        let exprnSeq = exprnSeqValue;
        let paramMap = { 'exprnSeq': exprnSeq };

        const res = await event.sendAjaxRequest("/experience/selectExprn.api", paramMap);
        await event.setExpereinceDetail(res.data);

        const exprnFxRes = await event.sendAjaxRequest("/experience/selectExperienceTimeList.api", paramMap);
        await event.setExprnFx(exprnFxRes.data, paramMap);

        const exprnOperateRes = await event.sendAjaxRequest("/experience/selectExprnOperateList.api", paramMap);
        await event.getExperienceTimeList(exprnOperateRes.data, paramMap);

        console.log(exprnOperateRes)
    }
    , setExpereinceDetail: (resData) => {
        console.log(resData)
        console.log(resData.exprnKndCodeStr)
        console.log(vm.exprnData)
        $("input#exprnKndCode").attr("placeholder", resData.exprnKndCodeStr);
        vm.exprnData = {
            ...vm.exprnData,
            exprnRegisterCnt: resData.exprnRegisterCnt,
            exprnWeekArray: resData.exprnWeekArray.split(','),
            exprnKndCodeStr: resData.exprnKndCodeStr, 
            exprnKndCode: resData.exprnKndCode, 
            exprnNm: resData.exprnNm,
            exprnSeq: resData.exprnSeq,
            startPeriodDt: resData.rcritBeginDt.substring(0, 10),
            endPeriodDt: resData.rcritEndDt.substring(0, 10),
            startPeriodHour: resData.rcritBeginDt.substring(11, 13),
            startPeriodMinute: resData.rcritBeginDt.substring(14, 16),
            endPeriodHour: resData.rcritEndDt.substring(11, 13),
            endPeriodMinute: resData.rcritEndDt.substring(14, 16),
            exprnPlaceNm: resData.exprnPlaceNm,
            studentCount: resData.exprnCo,
            exprnBeginDe: resData.exprnBeginDate,
            exprnEndDe: resData.exprnEndDate
        }

        vm.exprnUser.studentCount = resData.exprnCo
        vm.exprnList = {
            ...vm.exprnList,
            exprnBeginTimeHour: resData.exprnBeginTimeHour,
            exprnBeginTimeMinutes: resData.exprnBeginTimeMinutes,
            exprnEndTimeHour: resData.exprnEndTimeHour,
            exprnEndTimeMinutes: resData.exprnEndTimeMinutes,
            exprnBeginTime: resData.exprnBeginTimeHour + resData.exprnBeginTimeMinutes,
            exprnEndTime: resData.exprnEndTimeHour + resData.exprnEndTimeMinutes,
        }; 

    console.log(vm.exprnList)
        vm.exprnList.exprnBeginTimeArr.push(vm.exprnList.exprnBeginTime);
        vm.exprnList.exprnEndTimeArr.push(vm.exprnList.exprnEndTime);


        let daynum = vm.exprnData.exprnWeekArray;// ['3'] 
        let exprnSdate = new Date(vm.exprnData.exprnBeginDe);
        let exprnEdate = new Date(vm.exprnData.exprnEndDe);
        let exprnSeqArray = [];
        let exprnDtArray = [];
        let sortDate = [];


        // 요일변환 numToDay(obj)
        for (var i = 0; i < daynum.length; i++) {

            if (daynum !== "") {

                if (!(exprnSdate instanceof Date && exprnEdate instanceof Date)) return "Not Date Object";
                
                if(vm.exprnData.exprnSeqArray.includes(exprnSdate.getDay().toString())){
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

            vm.exprnList.exprnBeginTimeArr.push = vm.exprnList.exprnBeginTimeArr[i];			//체험예약 시작 시간 
            vm.exprnList.exprnEndTime = vm.exprnList.exprnEndTimeArr[i];					//체험예약 종료 시간  

        }

        let exprnTimeContainer = new Set(vm.exprnList.exprnTimeContainer)
        let exprnTimeContainerSet = [...exprnTimeContainer];


    }
    , setExprnFx: (resData, paramMap) => {
        console.log(resData)
        let resObject = resData
        console.log(resObject)
        let resDataSn = Object.keys(resObject)
    },
    getExperienceTimeList: (resData, paramMap) => {
        console.log(resData)
        vm.experienceTimeList = resData
        let data = Object.values(resData.list).flat()
        console.log(data)
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
                const result = {
                    exprnSn: [],
                    exprnSn2: [],
                    exprnDt: [],
                    exprnBeginTimeArr: [],
                    exprnBeginTimeHour: [],
                    exprnBeginTimeMinutes: [],
                    exprnEndTimeArr: [],
                    exprnEndTimeHour: [],
                    exprnEndTimeMinutes: []
                }

                groupedDataValue[idx].forEach(item => {
                    result.exprnSn.push(result.exprnBeginTimeArr.length + 1),
                    result.exprnSn2.push(item.exprnSn),
                        result.exprnBeginTimeHour.push(item.exprnBeginTimeHour),
                        result.exprnBeginTimeMinutes.push(item.exprnBeginTimeMinutes),
                        result.exprnEndTimeHour.push(item.exprnEndTimeHour),
                        result.exprnEndTimeMinutes.push(item.exprnEndTimeMinutes),
                        result.exprnBeginTimeArr.push(item.exprnBeginTimeHour + item.exprnBeginTimeMinutes),
                        result.exprnEndTimeArr.push(item.exprnEndTimeHour + item.exprnEndTimeMinutes)
                });
                const resultArray = [result];

                vm.exprnList = resultArray[0]
            }

            const exprnList = [];
            exprnList.push({
                exprnSn: vm.exprnList.exprnSn,
                exprnDt: vm.exprnList.exprnDt,
                exprnBeginTime: vm.exprnList.exprnBeginTimeArr,
                exprnBeginTimeHour: vm.exprnList.exprnBeginTimeHour,
                exprnBeginTimeMinutes: vm.exprnList.exprnBeginTimeMinutes,
                exprnEndTime: vm.exprnList.exprnEndTimeArr,
                exprnEndTimeHour: vm.exprnList.exprnEndTimeHour,
                exprnEndTimeMinutes: vm.exprnList.exprnEndTimeMinutes
            })

            vm.exprnList.exprnBeginTimeArr = [... new Set([...vm.exprnList.exprnBeginTimeArr])];
            vm.exprnList.exprnEndTimeArr = [... new Set([...vm.exprnList.exprnEndTimeArr])];
            vm.exprnList.exprnDt = [...new Set([...vm.exprnList.exprnDt])]

            const exprnSnLength = parseInt(vm.exprnList.exprnBeginTimeArr.length) * parseInt(vm.exprnList.exprnDt.length)

            const exprnSnArr = [];
            for (let i = 1; i <= exprnSnLength; i++) {
                exprnSnArr.push(i)
            }
            vm.exprnList.exprnSn2 = exprnSnArr
        })

        const startTimeSet = [...new Set([...vm.exprnList.exprnBeginTimeArr])];
        const endTimeSet = [...new Set([...vm.exprnList.exprnEndTimeArr])];
        const uniqueValues = [...new Set([...vm.exprnList.exprnSn])]
        const dataSet = [...new Set([...vm.exprnList.exprnDt])]

        const experienceTimeSetSessions = startTimeSet.map((startTimeSet, index) => `${uniqueValues[index]}회 ${startTimeSet}~${endTimeSet[index]}`
        )

        utils.clearChildren(`getExperienceSnTime2`)
        const experienceTimeSessionTag = experienceTimeSetSessions.map((experienceTimeSession, idx) => `<div class='exprnTimeHourTag dp_center' id='exprnTimeHourTag + ${idx + 1}' style='white-space: nowrap; text-wrap: nowrap;' >
        ${experienceTimeSession}
        <button id='deleteExprnTimeHour' type='button'  name='${idx + 1}' @click="fndeleteExprnTimeHour"><img src='/image/close.png' alt='${startTimeSet}&${endTimeSet}' id='${vm.exprnList.exprnDt}' name='${idx}' class='delete-keyword-btn '/></button></div> `);
        $("#getExperienceSnTime").append(experienceTimeSessionTag);
        console.log(experienceTimeSessionTag)


    },  
    DeleteExprnTimeHour: (target) => {
        console.log('삭제시도')
        console.log(target)
        const idexprndt = target.id.split(',');
        const deletedExprndt = [...new Set(Object.values(idexprndt))]
        const idx = target.name;
        if (target.tagName === 'IMG') {
            const altTimeValue = target.alt.split('&');
            const startTimeSet = altTimeValue[0].split(',');
            const endTimeSet = altTimeValue[1].split(',');
            const deletedDt = deletedExprndt[idx]
            const snfilter = vm.exprnList.exprnSn.reduce((acc, num) => { if (!acc.includes(num)) acc.push(num); return acc; }, []) // 사용안하는 변수?

            console.log(snfilter)
            console.log(idexprndt)
            console.log(deletedDt)

            const deletedStartTime = startTimeSet[idx] !== undefined ? startTimeSet[idx] : startTimeSet.toString();
            const deletedEndTime = endTimeSet[idx] !== undefined ? endTimeSet[idx] : endTimeSet.toString()
            var index = startTimeSet.indexOf(deletedStartTime);
            const deletedSn = parseInt(index) + 1
            console.log(deletedSn)

            vm.exprnList.deletedStartTime = deletedStartTime
            vm.exprnList.deletedEndTime = deletedEndTime
            vm.exprnList.deletedSn = deletedSn

            // 결과를 담을 배열
            const resultArray3 = [];
            // 입력 데이터의 길이를 가져옵니다.
            const dataLength = vm.exprnList.exprnSn !== undefined ? vm.exprnList.exprnSn.length : vm.exprnList.exprnBeginTimeArr.length;

            for (let i = 0; i < dataLength; i++) {
                resultArray3.push({
                    "deletedDt": vm.exprnList.exprnDt,
                    "deletedStartTime": vm.exprnList.deletedStartTime,
                    "deletedEndTime": vm.exprnList.deletedEndTime
                });
            }
            vm.exprnDeletedList.push(resultArray3)
            vm.exprnList.exprnBeginTimeArr = vm.exprnList.exprnBeginTimeArr.filter(time => time !== deletedStartTime)
            vm.exprnList.exprnEndTimeArr = vm.exprnList.exprnEndTimeArr.filter(time => time !== deletedEndTime)
        }

    } ,plusExperienceTime: (e) => {
        setSession = [vm.exprnList.exprnBeginTime, vm.exprnList.exprnEndTime]
        let exprnBeginTime = vm.exprnList.exprnBeginTimeHour + vm.exprnList.exprnBeginTimeMinutes
        let exprnEndTime = vm.exprnList.exprnEndTimeHour + vm.exprnList.exprnEndTimeMinutes

        vm.exprnList.exprnBeginTime = exprnBeginTime
        vm.exprnList.exprnEndTime = exprnEndTime

        vm.exprnList.experienceTimeSetSession = [vm.exprnList.exprnBeginTime, vm.exprnList.exprnEndTime]

        const exprnSnLength = parseInt(vm.exprnList.exprnBeginTimeArr.length);
        const exprnSnArr = [];
        for (let i = 1; i <= exprnSnLength; i++) {
            exprnSnArr.push(i)
        }
        const startTimeSet = [...new Set([...vm.exprnList.exprnBeginTimeArr])]
        const endTimeSet = [...new Set([...vm.exprnList.exprnEndTimeArr])]
        const uniqueValues = exprnSnArr
        console.log(startTimeSet)
        console.log(endTimeSet)
        console.log(uniqueValues)
        const experienceTimeSessions = startTimeSet.map((startTimeSet, index) => `${uniqueValues[index]}회 ${startTimeSet}~${endTimeSet[index]}`); 

        const experienceTimeSessionTag =  `<div class='exprnTimeHourTag dp_center' id='exprnTimeHourTag' style='white-space: nowrap; text-wrap: nowrap;' >${exprnBeginTime}`+'~'+`${exprnEndTime}<button id='deleteExprnTimeHour' type='button'  @click="fndeleteExprnTimeHour"><img src='/image/close.png' alt='${exprnBeginTime}&${exprnEndTime}' id='${vm.exprnList.exprnDt}' class='delete-keyword-btn'/></button></div> `

        $("#getExperienceSnTime").append(experienceTimeSessionTag);
        console.log(experienceTimeSessionTag) 

        vm.exprnList.exprnBeginTimeArr.push(vm.exprnList.exprnBeginTime);
        vm.exprnList.exprnEndTimeArr.push(vm.exprnList.exprnEndTime);
    }

}


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
    $.datepicker.setDefaults({
        changeMonth: false,
        changeYear: false,
    });
    event.getExperienceDetail();
    /* 상담 기간는 현재 일자 이후로 선택 가능 */
    $("#datepickerFromexprn").datepicker("option", "minDate", util.date.addDateDash(util.date.getToday()));
    $("#datepickerToexprn").datepicker("option", "minDate", util.date.addDateDash(util.date.getToday()));
    /* 모집기간 시작일자, 종료일자는 현재 일자 이후로 선택 가능 */
    $("#startPeriodDt").datepicker("option", "minDate", util.date.addDateDash(util.date.getToday()));
    $("#endPeriodDt").datepicker("option", "minDate", util.date.addDateDash(util.date.getToday()));

});


