var vueData = {
    step: "master",
    totalCount: '',
    profsrUserList: {},
    cnsltWeekArray: [],
    inputText: '',
    cnsltSn: [], 
    cnsltData: {
        cnsltWeekArray: [],
        cnsltDtArray: [],
        cnsltSeqArray: [],
        cnsltEndTimeArr: [],
        cnsltBeginTimeArr: []
    }, // tb_cnslt  
    cnsltList: {
        cnsltSn: [],
        cnsltDt: [],
        cnsltEndTimeArr: [],
        cnsltBeginTimeArr: [],
        cnsltBeginTimeHour: [],
        cnsltBeginTimeMinutes: [],
        cnsltEndTimeHour: [],
        cnsltEndTimeMinutes: [], 
    }, 
    searchData: {
        searchText: '',
    },
    getConsultTime: '',
    userSeq: '',
    profsrUserNum: [],
    profsrUserName: '',
    profsrUserEmail: '',
    profsrUserSeq: '', 
    cnsltDeletedList: []
};



let dataPerPage = 10;
let pagePerBar = 10;
let pageCount = 10;

const urlParams = new URL(location.href).searchParams;
const cnsltSeq = urlParams.get('cnsltSeq');
const paramMap = { 'cnsltSeq': cnsltSeq };
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
            fnselectCnsltSe: () => {
                $(document).on("click", "#cnsltSe", function (e) {
                    if (vm.cnsltData.cnsltKndCode == 'CNSLT_KND_CODE_1') {
                        vm.cnsltData.cnsltCo = 1
                        $("#cnsltCo").val("1").prop("selected", true);
                        $("#cnsltCo").attr("disabled", true);
                    } else if (vm.cnsltData.cnsltKndCode == 'CNSLT_KND_CODE_2') {
                        $("#cnsltCo").attr("disabled", false);
                    }
                })
            }
            , fnGetConsultTime: () => {
                vm.cnsltList.cnsltBeginTime = vm.cnsltList.cnsltBeginTimeHour + vm.cnsltList.cnsltBeginTimeMinutes
                vm.cnsltList.cnsltEndTime = vm.cnsltList.cnsltEndTimeHour + vm.cnsltList.cnsltEndTimeMinutes;
                vm.cnsltList.consultTimeSetSession = [vm.cnsltList.cnsltBeginTime, vm.cnsltList.cnsltEndTime];
                event.plusConsultTime();
            } 
            , fnprofsrUserSeqModal: async () => {
                vm.cnsltData.userNm = ""
                vm.cnsltData.userEmail = ""
                $('.profsrUserSeq').show();
                // 여기에 ajasx로 user_Seq 갖고오기 
                const res = await event.sendAjaxRequest("/consult/selectProfsrUserSeq.api", vm.searchData);


                vm.totalCount = res.data.length;
                vm.profsrUserList = res.data;
                fnPaging(res.data.totalCount, dataPerPage, pageCount, res.data.pageNo, (selectPage) => {vm.searchData.pageNo = selectPage;});

                let profsrUserNum = $("input[name='profsrUserNum']");
                let profsrUserSeq;  // 변수 선언
                for (let i = 0; i < profsrUserNum.length; i++) {
                    if (profsrUserNum[i].checked === true) {

                        profsrUserName = vm.profsrUserList[i].userNm;
                        profsrUserSeq = vm.profsrUserList[i].profsrUserSeq
                    }
                    vm.cnsltData.profsrUserSeq = profsrUserSeq
                }
            }
            , fnprofsrUserSeqInput: (event) => {
                let profsrUserNum = $("input[name='profsrUserNum']");
 
                for (let i = 0; i < profsrUserNum.length; i++) {
                    if (profsrUserNum[i].checked === true) {
                        profsrUserName = vm.profsrUserList[i].userNm
                        profsrUserEmail = vm.profsrUserList[i].userEmail
                        profsrUserSeq = vm.profsrUserList[i].userSeq

                    }

                    var updatedText = event.target.value;
                    vm.profsrUserList.profsrUserName = updatedText;
                    vm.profsrUserList.profsrUserSeq = profsrUserSeq;
                    profsrUserSeqtxtest = updatedText;
                    vm.cnsltData.profsrUserSeq = profsrUserSeq
                }
                let profsrText = "<div class='input-group' id='professor' > <div> <span class='profsr dp_center side-by-side' id='profsrUserName'>" + profsrUserName + "</span> <span class='profsr dp_center side-by-side' id='profsrUserEmail'>" + profsrUserEmail + "</span> </div>    <button v-if='cnsltData.userNm !== ''' id='deleteProfessor' type='button' ><img src='/image/close.png' class='delete-keyword-btn'/></button> </div>"

                $('#modal').modal("hide"); //닫기  
                $(document).ready(function () {
                    $("input#profsrUserSeqText").attr("placeholder", profsrUserName);

                    $("#professor").append(profsrText)
                });

            }
            , updateProfsrUserSeq: (event) => {
                var updatedText = event.target.value;
                vm.inputText = updatedText;
                vm.profsrUserList.profsrUserName = updatedText;
                vm.profsrUserList.profsrUserSeq = profsrUserSeq;
                profsrUserSeqtxtest = updatedText;

            }
            , fnSave: async (data) => {
                // 데이터 가공
                vm.cnsltData.cnsltWeekArray = Object.values(vm.cnsltData.cnsltWeekArray).sort().join();
                event.getDate()
                vm.cnsltData.cnsltBeginDe = util.formmater.removeDash(vm.cnsltData.cnsltBeginDe);
                vm.cnsltData.cnsltEndDe = util.formmater.removeDash(vm.cnsltData.cnsltEndDe);
                
                if(vm.cnsltData.startPeriodDt == null || vm.cnsltData.startPeriodDt == undefined ||vm.cnsltData.startPeriodDt == 'undefined undefined'){
                    vm.cnsltData.startPeriodDt == new Date().toISOString().slice(0, 10);
                }else{
                    vm.cnsltData.startPeriodDt = (vm.cnsltData.startPeriodDt + ' ' + vm.cnsltData.startPeriodHour + ':' + vm.cnsltData.startPeriodMinute).slice(0, 19)
                }
                if(vm.cnsltData.endPeriodDt== null || vm.cnsltData.endPeriodDt == undefined || vm.cnsltData.endPeriodDt == 'undefined undefined'){ 
                    let fixEperiodDt = new Date(new Date(vm.cnsltData.cnsltEndDe).setDate(new Date(vm.cnsltData.cnsltEndDe).getDate()-1)).toISOString().slice(0,10) // 상담시작날짜 하루전
                    vm.cnsltData.endPeriodDt == fixEperiodDt; 
                }else{
                    vm.cnsltData.endPeriodDt=  (vm.cnsltData.endPeriodDt + ' ' + vm.cnsltData.endPeriodHour + ':' + vm.cnsltData.endPeriodMinute).slice(0, 19)
                }

                let fixPerdiodDt =  new Date().toISOString().slice(0, 10);
                let fixEperiodDt =new Date(new Date(vm.cnsltData.cnsltEndDe).setDate(new Date(vm.cnsltData.cnsltEndDe).getDate()-1)).toISOString().slice(0,10) // 상담시작날짜 하루전
                if(vm.cnsltData.cnsltPlaceNm== null || vm.cnsltData.cnsltPlaceNm == undefined){
                    vm.cnsltData.cnsltPlaceNm == '공자아카데미'
                }
                //필수 입력 validation
                if (!event.requireValidation()) {
                    return false;
                }
             
                const payload = {
                    cnsltSeq: vm.cnsltData.cnsltSeq,
                    cnsltNm: vm.cnsltData.cnsltNm,
                    profsrUserSeq: vm.cnsltData.profsrUserSeq,
                    cnsltWeekArray: vm.cnsltData.cnsltWeekArray,
                    cnsltBeginDe: util.formmater.removeDash(vm.cnsltData.cnsltBeginDe),
                    cnsltEndDe: util.formmater.removeDash(vm.cnsltData.cnsltEndDe),
                    cnsltKndCode: vm.cnsltData.cnsltKndCode,
                    cnsltPlaceNm: vm.cnsltData.cnsltPlaceNm||'공자아카데미',
                    rcritBeginDt: vm.cnsltData.startPeriodDt|| fixPerdiodDt,
                    rcritEndDt: vm.cnsltData.endPeriodDt || fixEperiodDt, 
                    cnsltCo: vm.cnsltData.cnsltCo,
                    cnsltList: vm.cnsltData.cnsltList,
                };

                try {
                    const response = await event.sendAjaxRequest("/consult/updateCnslt.api", payload);

                    $.alert("교수상담 개설 수정이 완료되었습니다. 교수상담 개설 목록으로 이동합니다.", () => {
                        location.href = "consultList.html";
                    });
                } catch (error) {
                    console.error("Error while saving:", error);
                    // 다른 오류 처리 방법도 여기에 추가할 수 있습니다.
                }
            }
            , fnCancel: () => {
                $.confirm("변경사항을 취소 하시겠습니까?", () => {
                    vm.cnsltList = {};
                    vm.cnsltData = {};
                    $.alert("변경사항이 취소되었습니다. 교수상담 개설 목록으로 이동합니다.", () => {
                        location.href = "consultList.html";
                    })
                })
            }
        }
    })
    vm = app.mount('#content');
    if (typeof vm.timeCount === 'undefined') {
        if (vm.cnsltSn.length === 0) {
            timeCount = 0;
        } else {
            timeCount = parseInt(vm.cnsltSn[vm.cnsltSn.length - 1], 10) + 1;
        }
        vm.timeCount = timeCount;
    } else {
        timeCount = vm.timeCount;
    }
}

let event = {
    init: () => { 
        $(document).on("click", "#deleteProfessor", event.deleteProfessor);

        $(document).on("click", "#deleteCnsltTimeHour", function (e) {
            if (e.target.tagName === 'INPUT') {
                e.target.parentElement.remove();
            } else if (e.target.tagName === 'IMG') {
                e.target.parentElement.parentElement.remove();
            }
            console.log('삭제시도1');
            event.DeleteCnsltTimeHour(e.target);
        })
 
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
    deleteProfessor: () => {
        vm.profsrUserName = '';
        vm.profsrUserEmail = '';
        $("#professor2").children().remove();
        $("#professor").children().remove();
    },
    getDate: () => {

        let cnsltList = [];

        // cnsltBeginDe로 타겟날짜 생성
        const target = new Date(vm.cnsltData.cnsltBeginDe)
        const cnsltEdate = new Date(vm.cnsltData.cnsltEndDe);
        //console.log(vm.cnsltList)
        while (target <= cnsltEdate) { // 현재 타겟날 추출
            const targetWeekNum = target.getDay()
            let taragetDay = []
            console.log(new Date(target.setDate(target.getDate())))
  
            // 현재 타겟날이 주(week)배열(ex ['1', '3'])있을때만 for문 진입입
            if (vm.cnsltData.cnsltWeekArray.includes(targetWeekNum.toString())) {
                // vm.cnsltList.cnsltBeginTimeArr 배열개수만큼 생성
                for (let d = 0, i = 0; d < vm.cnsltData.cnsltWeekArray.split(',').length, i < vm.cnsltList.cnsltBeginTimeArr.length; i++, d++) {
                    cnsltList.push({
                        "cnsltDt": util.date.formatDateToYYYYMMDD(target),
                        "cnsltBeginTime": vm.cnsltList.cnsltBeginTimeArr[i], // "1114",
                        "cnsltEndTime": vm.cnsltList.cnsltEndTimeArr[i] // "1415"
                    })
                }
            } else {
                // 주(week)배열아니면 pass 
            }
            // 현재 타겟day는 상담마감날까지 1씩증가
            target.setDate(target.getDate() + 1);
        }
        //  const cnsltListSet = [...new Set(...cnsltList)]
        // idx로 cnsltSn 세팅
        cnsltList = cnsltList.map((cnslt, idx) => ({ ...cnslt, cnsltSn: idx + 1 }))
        vm.cnsltData.cnsltList = cnsltList
        console.log(cnsltList)

    }, 
    requireValidation: () => {
        const validations = [
            // { condition: () => vm.cnsltData.profsrUserSeq === undefined, message: "교수명을 선택하세요." },
            { condition: () => vm.cnsltList.cnsltBeginTimeArr <= 0, message: "상담시작 시간을 추가해주세요." },
           { condition: () => vm.cnsltList.cnsltEndTimeArr <=  0, message: "상담종료 시간을 추가해주세요." },
            //{ condition: () => vm.cnsltData.endPeriodDt <=  vm.cnsltData.rcritBeginDt, message: "모집기간 종료일자를 모집기간 시작일자 이후로 정해주세요." },
            { condition: () => vm.cnsltData.cnsltKndCode === undefined, message: "상담 형태를 선택해주세요." },
            //{ condition: () => vm.cnsltData.cnsltPlaceNm === undefined, message: "상담 장소를 입력해주세요." },
            { condition: () => vm.cnsltData.cnsltCo === undefined, message: "상담생 수를 선택해주세요." }, 
            { condition: () => vm.cnsltData.cnsltWeekArray.length === 0, message: "상담 요일을 선택하세요." },
            { condition: () => vm.cnsltList.cnsltDt.length < 0, message: "상담 요일이나 기간을 선택하세요." },
            { condition: () => vm.cnsltList.cnsltBeginTimeHour === undefined, message: "상담 시작 시간을 입력해주세요." },
            { condition: () => vm.cnsltList.cnsltBeginTimeMinutes === undefined, message: "상담 시작 분을 입력해주세요." },
            { condition: () => vm.cnsltList.cnsltEndTimeHour === undefined, message: "상담 종료 시간을 입력해주세요." },
            { condition: () => vm.cnsltList.cnsltEndTimeMinutes === undefined, message: "상담 종료 분을 입력해주세요." }, 
            //{ condition: () => vm.cnsltData.startPeriodDt === undefined, message: "모집기간 시작일자를 입력해주세요." }, 
            //{ condition: () => vm.cnsltData.cnsltPlaceNm.trim() === "", message: "상담 장소를 입력해주세요." },
            //{ condition: () => vm.cnsltData.startPeriodDt === "", message: "모집기간 시작일자를 입력해주세요." },
            //{ condition: () => vm.cnsltData.endPeriodDt === "", message: "모집기간 종료 일자를 입력해주세요." } 
        ];
        for (const validation of validations) {
            if (validation.condition()) {
                $.alert(validation.message);
                return false;
            }
        }
        return true;
    },
    getConsultDetail: async () => {
// 현재 페이지의 URL을 가져오기
var currentUrl = window.location.href;

// URL을 '&'로 나눠서 파라미터들을 배열로 저장
var urlParams = currentUrl.split('&');

// 파라미터 배열을 순회하면서 'cnsltSeq'를 찾기
var cnsltSeqValue;
for (var i = 0; i < urlParams.length; i++) {
    // 'cnsltSeq'를 포함한 파라미터를 찾으면 값을 추출
    if (urlParams[i].indexOf('cnsltSeq=') !== -1) {
        cnsltSeqValue = urlParams[i].split('=')[1];
        break; // 값을 찾았으므로 루프 종료
    }
}

// 추출된 cnsltSeq의 값을 확인
console.log('cnsltSeq 값:', cnsltSeqValue);

        let cnsltSeq = cnsltSeqValue;
        const paramMap = { 'cnsltSeq': cnsltSeq };

        const res = await event.sendAjaxRequest("/consult/selectCnslt.api", paramMap);
        await event.setConsultDetail(res.data);
        console.log(res)
        const cnsltFxRes = await event.sendAjaxRequest("/consult/selectConsultTimeList.api", paramMap);
        await event.setCnsltFx(cnsltFxRes.data, paramMap); 
        console.log(cnsltFxRes)
        const cnsltOperateRes = await event.sendAjaxRequest("/consult/selectCnsltOperateList.api", paramMap);  
        await event.getConsultTimeList(cnsltOperateRes.data, paramMap);
        console.log(cnsltOperateRes)
    }
    , setConsultDetail: (resData) => {
        console.log(resData)
        $("input#profsrUserSeqText").attr("placeholder", resData.userNm);
        let profsrUserName = resData.userNm
        let profsrUserEmail = resData.userEmail
        let professor = document.querySelector('#professor')
        let profsrText = "<div class='input-group' id='professor' > <div> <span class='profsr dp_center side-by-side' id='profsrUserName'>" + profsrUserName + "</span> <span class='profsr dp_center side-by-side' id='profsrUserEmail'>" + profsrUserEmail + "</span> </div>    <button v-if='cnsltData.userNm !== ''' id='deleteProfessor' type='button' ><img src='/image/close.png' class='delete-keyword-btn'/></button> </div>"


        $("#professor").append(profsrText)
  
        // Set cnsltData properties
        vm.cnsltData = {
            ...vm.cnsltData,
            cnsltNm: resData.cnsltNm,
            profsrUserSeq: resData.profsrUserSeq,
            cnsltWeekArray: resData.cnsltWeekArray.split(','),
            cnsltSeStr: resData.cnsltSeStr,
            cnsltKndCode: resData.cnsltKndCode,
            cnsltSeq: resData.cnsltSeq,
            startPeriodDt: resData.rcritBeginDt.substring(0, 10),
            endPeriodDt: resData.rcritEndDt.substring(0, 10),
            startPeriodHour: resData.rcritBeginDt.substring(11, 13),
            startPeriodMinute: resData.rcritBeginDt.substring(14, 16),
            endPeriodHour: resData.rcritEndDt.substring(11, 13),
            endPeriodMinute: resData.rcritEndDt.substring(14, 16),
            cnsltPlaceNm: resData.cnsltPlaceNm,
            cnsltCo: resData.cnsltCo,
            cnsltBeginDe: resData.cnsltBeginDate,
            cnsltEndDe: resData.cnsltEndDate
        };

        // Set cnsltList properties
        vm.cnsltList = {
            ...vm.cnsltList,
            cnsltBeginTimeHour: resData.cnsltBeginTimeHour,
            cnsltBeginTimeMinutes: resData.cnsltBeginTimeMinutes,
            cnsltEndTimeHour: resData.cnsltEndTimeHour,
            cnsltEndTimeMinutes: resData.cnsltEndTimeMinutes,
            cnsltEndTime: resData.cnsltEndTimeHour + resData.cnsltEndTimeMinutes,
            cnsltBeginTime: resData.cnsltBeginTimeHour + resData.cnsltBeginTimeMinutes
        }; 

        vm.cnsltList.cnsltBeginTimeArr.push(vm.cnsltList.cnsltBeginTime);
        vm.cnsltList.cnsltEndTimeArr.push(vm.cnsltList.cnsltEndTime);
 

        let daynum = resData.cnsltWeekArray.split(','); // ['3']
        let cnsltSdate = new Date(vm.cnsltData.cnsltBeginDe)
        let cnsltEdate = new Date(vm.cnsltData.cnsltEndDe)

        let cnsltSeqArray = [];
        let cnsltDtArray = [];
        let sortDate = [];
        // 요일변환 numToDay(obj)
        for (var i = 0; i < daynum.length; i++) {
            if (daynum !== "") {
                if (!(cnsltSdate instanceof Date && cnsltEdate instanceof Date)) return "Not Date Object";
                if (vm.cnsltData.cnsltSeqArray.includes(cnsltSdate.getDay().toString())) {
                    vm.cnsltData.cnsltDtArray.push(vm.cnsltData.cnsltSdate);
                }
                while (cnsltSdate <= new Date(cnsltEdate)) {
                    cnsltDtArray.push(cnsltSdate.toISOString().split("T")[0]) // object
                    cnsltSeqArray.push(cnsltSdate.getDay); // object result getDay 나타내는 숫자 
                    cnsltSdate.setDate(cnsltSdate.getDate() + 1);
                }
                for (var t = 0; t < cnsltDtArray.length; t++) {
                    if (cnsltSeqArray[t] == daynum) {
                        setDate.push(cnsltDtArray[t])
                    }
                    sortDate = vm.cnsltList.cnsltDt
                    vm.cnsltData.cnsltDtArray.push(sortDate)
                }
            }
        }
        var cnsltList = []
        for (var t = 0; t < vm.cnsltList.cnsltDt.length; t++) {
            for (var d = 0; d < vm.cnsltList.cnsltBeginTimeArr.length; d++) {
                a = {
                    cnsltSn: cnsltList.length + 1,
                    cnsltDt: Util.formmater.removeDash(vm.cnsltList.cnsltDt[t].toString()),
                    cnsltBeginTime: vm.cnsltList.cnsltBeginTimeArr[d],
                    cnsltEndTime: vm.cnsltList.cnsltEndTimeArr[d]
                }
                cnsltList.push(a)
                vm.cnsltData.cnsltList = cnsltList
            }
        }

        $('#cnsltCo').on('change', function () { $('select option[value=' + resData.cnsltCo + ']').prop('selected', true); });

        vm.cnsltList.cnsltTimeContainer = [];
        vm.cnsltList.cnsltTimeContainerSet = [];
        for (let i = 0; i < vm.cnsltList.cnsltBeginTimeArr.length; i++) {
            vm.cnsltList.cnsltBeginTimeArr.push = vm.cnsltList.cnsltBeginTimeArr[i];
            vm.cnsltList.cnsltEndTime = vm.cnsltList.cnsltEndTimeArr[i];
            let cnsltTimeSet = util.cnTime(vm.cnsltList.cnsltBeginTime) + '-' + util.cnTime(vm.cnsltList.cnsltEndTime)
            vm.cnsltList.cnsltTimeContainer.push(cnsltTimeSet);

        }

        let cnsltTimeContainer = new Set(vm.cnsltList.cnsltTimeContainer)
        let cnsltTimeContainerSet = [...cnsltTimeContainer];
 
    }
    , setCnsltFx: (resData, paramMap) => {

        let resObject = resData
        let resDataSn = Object.keys(resData) 
    },
    
    getConsultTimeList: (resData) => {
 
        vm.consultTimeList = resData;  
        let data = Object.values(resData.list).flat()
        console.log(data)
        let groupedData = {};

        data.forEach(item => {
            if (!groupedData[item.cnsltSeq]) {
                groupedData[item.cnsltSeq] = [];
            }
            groupedData[item.cnsltSeq].push(item)
        });
        const groupedDataKey = Object.keys(groupedData)
        const groupedDataValue = Object.values(groupedData)
        groupedDataValue.forEach((item, idx) => {
            if (groupedDataKey[idx] === cnsltSeq) {
                //console.log(groupedDataKey[idx])
                const result = {
                    cnsltSn: [],
                    cnsltSn2: [],
                    cnsltDt: [],
                    cnsltBeginTimeArr: [],
                    cnsltBeginTimeHour: [],
                    cnsltBeginTimeMinutes: [],
                    cnsltEndTimeArr: [],
                    cnsltEndTimeHour: [],
                    cnsltEndTimeMinutes: []
                }

                groupedDataValue[idx].forEach(item => {
                    result.cnsltSn.push(result.cnsltBeginTimeArr.length + 1),
                        result.cnsltSn2.push(item.cnsltSn),
                        result.cnsltBeginTimeHour.push(item.cnsltBeginTimeHour),
                        result.cnsltBeginTimeMinutes.push(item.cnsltBeginTimeMinutes),
                        result.cnsltEndTimeHour.push(item.cnsltEndTimeHour)
                    result.cnsltEndTimeMinutes.push(item.cnsltEndTimeMinutes),
                        result.cnsltBeginTimeArr.push(item.cnsltBeginTimeHour + item.cnsltBeginTimeMinutes),
                        result.cnsltEndTimeArr.push(item.cnsltEndTimeHour + item.cnsltEndTimeMinutes)
                });

                const resultArray = [result];
                //console.log(resultArray)

                vm.cnsltList = resultArray[0]
            }

            const cnsltList = [];
            cnsltList.push({
                cnsltSn: vm.cnsltList.cnsltSn,
                cnsltDt: vm.cnsltList.cnsltDt,
                cnsltBeginTime: vm.cnsltList.cnsltBeginTimeArr,
                cnsltBeginTimeHour: vm.cnsltList.cnsltBeginTimeHour,
                cnsltBeginTimeMinutes: vm.cnsltList.cnsltBeginTimeMinutes,
                cnsltEndTime: vm.cnsltList.cnsltEndTimeArr,
                cnsltEndTimeHour: vm.cnsltList.cnsltEndTimeHour,
                cnsltEndTimeMinutes: vm.cnsltList.cnsltEndTimeMinutes
            })
            //console.log(cnsltList)
            //console.log(vm.cnsltList.cnsltSn)

            vm.cnsltList.cnsltBeginTimeArr = [... new Set([...vm.cnsltList.cnsltBeginTimeArr])]
            vm.cnsltList.cnsltEndTimeArr = [...new Set([...vm.cnsltList.cnsltEndTimeArr])]
            vm.cnsltList.cnsltDt = [...new Set([...vm.cnsltList.cnsltDt])]

            const cnsltSnLength = parseInt(vm.cnsltList.cnsltBeginTimeArr.length) * parseInt(vm.cnsltList.cnsltDt.length)

            const cnsltSnArr = [];
            for (let i = 1; i <= cnsltSnLength; i++) {
                cnsltSnArr.push(i)
            }
            vm.cnsltList.cnsltSn2 = cnsltSnArr
            //console.log(vm.cnsltList)

        })
        const startTimeSet = [...new Set([...vm.cnsltList.cnsltBeginTimeArr])];
        const endTimeSet = [...new Set([...vm.cnsltList.cnsltEndTimeArr])];
        const uniqueValues = [...new Set([...vm.cnsltList.cnsltSn])]
        const dateSet = [... new Set([...vm.cnsltList.cnsltDt])]
        console.log(startTimeSet)
        console.log(endTimeSet)
        //console.log(uniqueValues)
        const consultTimeSessions = startTimeSet.map((startTimeSet, index) =>
            `${uniqueValues[index]}회 ${startTimeSet}~${endTimeSet[index]}`
        );
console.log(endTimeSet)
        utils.clearChildren('getConsultSnTime2');
        const consultTimeSessionTag = consultTimeSessions.map((consultTimeSession, idx) =>
            `<div class='cnsltTimeHourTag dp_center' id='cnsltTimeHourTag + ${idx + 1}' style='white-space: nowrap; text-wrap: nowrap;'>
    ${consultTimeSession}<button id='deleteCnsltTimeHour' type='button' name='${idx + 1}' @click="fndeleteCnsltTimeHour">
    <img src='/image/close.png' alt='${startTimeSet}&${endTimeSet}'  id='${vm.cnsltList.cnsltDt}' name='${idx}' class='delete-keyword-btn '/> </button></div>`);
        $("#getConsultSnTime").append(consultTimeSessionTag);

         console.log(consultTimeSessionTag);
     
 
    },    
    DeleteCnsltTimeHour: (target) => {
        console.log('삭제시도')
        console.log(target)
        const idcnsltdt = target.id.split(',');
        const deletedCnsltdt = [... new Set(Object.values(idcnsltdt))] 
        const idx = target.name;
        if (target.tagName === 'IMG') {

            const altTimeValue = target.alt.split('&');
            const startTimeSet = altTimeValue[0].split(',')
            const endTimeSet = altTimeValue[1].split(',')
            const deletedDt = deletedCnsltdt[idx]
            const snfilter = vm.cnsltList.cnsltSn.reduce((acc, num) => { if (!acc.includes(num)) acc.push(num); return acc; }, [])// 사용안하는 변수 ?
           console.log(snfilter)
            console.log(idcnsltdt) 
            console.log(deletedDt) 
         
            
            const deletedStartTime = startTimeSet[idx] !== undefined ? startTimeSet[idx] : startTimeSet.toString();
            const deletedEndTime = endTimeSet[idx] !== undefined ? endTimeSet[idx] : endTimeSet.toString()
            var index = startTimeSet.indexOf(deletedStartTime); 
            const deletedSn = parseInt(index) + 1  
            console.log(deletedSn) 
            vm.cnsltList.deletedStartTime = deletedStartTime
            vm.cnsltList.deletedEndTime = deletedEndTime
            vm.cnsltList.deletedSn = deletedSn
 
            // 결과를 담을 배열
            const resultArray3 = [];
 // 입력 데이터의 길이를 가져옵니다.
 const dataLength = vm.cnsltList.cnsltSn !== undefined ? vm.cnsltList.cnsltSn.length : vm.cnsltList.cnsltBeginTimeArr.length;


          // 입력 데이터를 반복하면서 원하는 형식으로 변환
          for (let i = 0; i < dataLength; i++) {
            resultArray3.push({
                "deletedDt": vm.cnsltList.cnsltDt,
                "deletedStartTime": vm.cnsltList.deletedStartTime,
                "deletedEndTime": vm.cnsltList.deletedEndTime

            });
        }
            vm.cnsltDeletedList.push(resultArray3)

            vm.cnsltList.cnsltBeginTimeArr = vm.cnsltList.cnsltBeginTimeArr.filter(time => time !== deletedStartTime)
            vm.cnsltList.cnsltEndTimeArr = vm.cnsltList.cnsltEndTimeArr.filter(time => time !== deletedEndTime)
        } 
    },
    plusConsultTime: (e) => {
        //console.log(vm.cnsltList)
        SetSession = [vm.cnsltList.cnsltBeginTime, vm.cnsltList.cnsltEndTime]
        let cnsltBeginTime = vm.cnsltList.cnsltBeginTimeHour + vm.cnsltList.cnsltBeginTimeMinutes
        let cnsltEndTime = vm.cnsltList.cnsltEndTimeHour + vm.cnsltList.cnsltEndTimeMinutes

        vm.cnsltList.cnsltBeginTime = cnsltBeginTime
        vm.cnsltList.cnsltEndTime = cnsltEndTime

        vm.cnsltList.consultTimeSetSession = [vm.cnsltList.cnsltBeginTime, vm.cnsltList.cnsltEndTime]
        const cnsltSnLength = parseInt(vm.cnsltList.cnsltBeginTimeArr.length);
        const cnsltSnArr = [];
        for (let i = 1; i <= cnsltSnLength; i++) {
            cnsltSnArr.push(i)
        }
        const startTimeSet = [...new Set([...vm.cnsltList.cnsltBeginTimeArr])]
        const endTimeSet = [...new Set([...vm.cnsltList.cnsltEndTimeArr])]
        const uniqueValues = cnsltSnArr
        const consultTimeSessions = startTimeSet.map((startTimeSet, index) =>
            `${uniqueValues[index]}회 ${startTimeSet}~${endTimeSet[index]}}`);

        const consultTimeSessionTag = `<div class='cnsltTimeHourTag dp_center' id='cnsltTimeHourTag' style='white-space: nowrap; text-wrap: nowrap;'>
           ${cnsltBeginTime}` + '~' + `${cnsltEndTime}<button id='deleteCnsltTimeHour' type='button' @click="fndeleteCnsltTimeHour">
           <img src='/image/close.png' alt='${cnsltBeginTime}&${cnsltEndTime}'  id='${vm.cnsltList.cnsltDt}' class='delete-keyword-btn '/> </button></div>`


        $("#getConsultSnTime").append(consultTimeSessionTag);

        vm.cnsltList.cnsltBeginTimeArr.push(vm.cnsltList.cnsltBeginTime);
        vm.cnsltList.cnsltEndTimeArr.push(vm.cnsltList.cnsltEndTime);

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
    event.getConsultDetail();

    /* 상담 기간는 현재 일자 이후로 선택 가능 */
    $("#datepickerFromConsult").datepicker("option", "minDate", util.date.addDateDash(util.date.getToday()));
    $("#datepickerToConsult").datepicker("option", "minDate", util.date.addDateDash(util.date.getToday()));
    /* 모집기간 시작일자, 종료일자는 현재 일자 이후로 선택 가능 */
    $("#startPeriodDt").datepicker("option", "minDate", util.date.addDateDash(util.date.getToday()));
    $("#endPeriodDt").datepicker("option", "minDate", util.date.addDateDash(util.date.getToday()));
    ;
});


