var vueData = { 
	exprnData : {
		  exprnCode : "",
		 startHour : "",				// 시작 시간
		 startMinute : "",			// 시작 분
		 endHour : "",				// 종료 시간
		 endMinute : "",				// 종료 분
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
		 exprnParticipantUserArray : [], 
		 exprnUserArrayUser : "",				//   
		 studentNameUser : "",				//   
		 psitnNmUser : "",				//   
		 userAuthorUser : "",				//  
		 studentInnbUser : "",				//   
		 exprnUserArrayParticipants : "",				//   
		 studentNameParticipants : "",				//   
		 userAuthorParticipants : "",				//  
		 psitnNmParticipants  : "",				//  
		 studentInnbParticipants   : "",				//  
		 exprnUserArray : "",
		 exprnSttusSe : "",
		 exprnUserSeq : "",
	},
	exprnDetail :{
        startHour : "",				// 시작 시간
        startMinute : "",			// 시작 분
        endHour : "",				// 종료 시간
        endMinute : "",				// 종료 분
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
    preview:"",
    exprnOperateList: [],
    exprnUser : {},
    exprnUserList :  [],
    exprnUserArray : [],
    exprnUserArrayList:{}
    
};
 
let vm;
var vueInit = () => {
	const app = Vue.createApp({
		data() {
			return vueData;
		},
		methods: {   
			fnExperienceCnclUpdt:() => {
			 
 			let urlParams = new URL(location.href).searchParams;
        	let exprnSeq = urlParams.get('exprnSeq');
        	let exprnSn = urlParams.get('exprnSn');
       	 	 vm.exprnData.exprnSeq =exprnSeq
       	 	 vm.exprnData.exprnSn =exprnSn 
				var text = vm.exprnData.canclDc;
				text = text.replace(/(?:\r\n|\r|\n)/g, '<br>');
				vm.exprnData.canclDc =  text 
				 
			 
			let formData = new FormData();
    		formData.append('paramMap', new Blob([JSON.stringify(vm.exprnData.canclDc)], {type: 'application/json'}));
    		 //console.log(vm.exprnData.canclNtcnArray)
                if(vm.exprnData.canclNtcnArray != null){
					vm.exprnData.canclNtcnArray = Object.values(vm.exprnData.canclNtcnArray.sort()).join()  
				}
             
				if(vm.exprnData.canclNtnArray === ''){
					$.alert ("카테고리를 선택하세요.");
					return false;
				}
				if(util.emptyCheck(vm.exprnData.canclDc) === ''){
					$.alert ("답변내용을 입력하세요.");
					return false;
				}
				if(vm.exExprnSe !== vm.exprnData.canclNtnArray){
					vm.answerData.cnExprnSe = vm.exprnData.exprnSe
				}  
					$.sendAjax({
						url: "/experience/updateExperienceCancl.api",
                    data: {
						canclCode : vm.exprnData.canclCode,
						canclDc: vm.exprnData.canclDc,
						canclNtcnArray: vm.exprnData.canclNtcnArray,
                		useAt: 'N',
						exprnSeq: vm.exprnData.exprnSeq,
						exprnSn: vm.exprnData.exprnSn 
					},
					contentType: "application/json",
						success : (res) => {
						$.alert("취소 사유가 등록되었습니다. 체험 예약 운영 목록으로 이동합니다.", () => {
							location.href = "experienceFx.html";
							})
						}
						, error: function(e) {
							$.alert(e.responseJSON.message);
						}			
					})
			},
		  fnUpdateExprnAttender : async (resData) =>{
		//console.log(resData) 
            let urlParams = new URL(location.href).searchParams;
            let exprnSeq = urlParams.get('exprnSeq');
            let exprnSn = urlParams.get('exprnSn'); 
            vm.exprnUser.exprnSeq =exprnSeq 
            vm.exprnUser.exprnSn =exprnSn 
            vm.exprnUser.exprnUserSeq =vm.exprnData.exprnUserSeq 
            vm.exprnUser.exprnSttusSe  =vm.exprnData.exprnSttusSe = "A" 
            
        let paramMap =
        {
            "exprnSttusSe": "Y",
            "exprnSeq": vm.exprnData.exprnSeq,
            "exprnSn": vm.exprnData.exprnSn,
            "exprnUserSeq":vm.exprnUserArrayList.exprnUserSeq
        }
    
        
              await  $.sendAjax({
                    url: "/experience/updateExprnAttender.api",
                    data: paramMap,
                    contentType: "application/json",
            success:  (resData) => {
				//console.log(resData)
						$.alert("체험확인이 되었습니다."); 
            		},
                    error: function (e) {
                        $.alert(e.responseJSON.message);
                    },
                }); 
	}
	// 상태 변경 함수
	, fnChangeStatus : (button, fromStatus, toStatus) => {
    var row = button.parentElement.parentElement;
    var index = Array.from(row.parentElement.rows).indexOf(row);
    if (getStatus(index) === fromStatus) { // getStatus 함수는 현재 상태를 가져오는 로직이어야 함
        setStatus(index, toStatus); // setStatus 함수는 새로운 상태를 설정하는 로직이어야 함
        button.innerHTML = toStatus === 'A' ? '확인됨' : '신청확인';
    }
},
			fnExprnCanclCode: ()=>{
				$(document).on("click", "#exprnCanclCode", function (e) { 
				if(vm.exprnData.exprnCanclCode == 'EXPRN_CANCEL_REASON1'){
					vm.exprnData.exprnCodeList = '일정 변경' 
				 }else if(vm.exprnData.exprnCanclCode == 'EXPRN_CANCEL_REASON2') {
					vm.exprnData.exprnCodeList = '지원자 부족' 
					} 
			 	}) 
			} 
			,fnCancel : () => {
				$.confirm("지금까지 입력한 내용이 모두 사라집니다. 정말 취소하시겠습니까?", () => {
					vm.exprnData.canclDc = ''
					vm.exprnData.useAt = 'N'
					$.confirm("입력한 내용이 취소되어 목록으로 이동합니다.", () => {
						location.href="experienceFx.html"
					})
				})
			}
		  }
	})
	vm = app.mount('#content');
} 

let  event = {
	
    init: () => {
		

var exprnCrftTable = document.getElementById("exprnCrftTable"); 

if (vm.exprnData.exprnRegisterCnt != 0) {
    for (var i = 0; i < vm.exprnData.exprnRegisterCnt; i++) {
        var row = exprnCrftTable.insertRow(-1);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        cell1.innerHTML = "신청자" + (i + 1);
        cell2.innerHTML = '<button onclick="changeStatus(this, \'R\', \'A\')">신청확인</button>';
//console.log(row)
//console.log(cell1)
//console.log(cell2)
        // 초기 상태를 'R'로 설정
        setStatus(i, 'R');
    }
} else if (vm.exprnData.exprnParticipantUserCnt != 0) {
    // 체험 신청자가 'A'값인 사람이 있다면 테이블을 보이고
    // 체험자 신청확인 버튼을 비활성화 할 수 있게 하고 버튼색상을 바꿈
    var rows = exprnCrftTable.rows;
    for (var i = 0; i < rows.length; i++) {
        var button = rows[i].cells[1].querySelector('button');
        if (button && getStatus(i) === 'A') { // getStatus 함수는 현재 상태를 가져오는 로직이어야 함
            button.disabled = true;
            button.style.backgroundColor = "grey";
        }
    }
}

        $(document).on("click", "#btnList", function (e) {
            location.href = "experienceFx.html";
        });
        $(document).on("click", "#btnFileDownloadForRegister", function (e) {
            let exprnUserArray = vm.exprnData.exprnUserArray;
            let paramMap =
                {'exprnUserArray':
                    exprnUserArray};
            $.sendAjax({
                url: "/experience/getCurrentUserListExcel.api",
                data: paramMap,
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
            let urlParams = new URL(location.href).searchParams;
            let exprnSeq = urlParams.get('exprnSeq');
            let exprnSn = urlParams.get('exprnSn');
            let paramMap = {'exprnSeq':exprnSeq, 'exprnSn' : exprnSn};
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
        $(document).on("click", "#btnCancelExprn", function (e) {
            let urlParams = new URL(location.href).searchParams;
            let exprnSeq = urlParams.get('exprnSeq');
            let exprnSn = urlParams.get('exprnSn');
            location.href = "experienceOperateDetailCancel.html?exprnSeq=" + exprnSeq + "&exprnSn=" + exprnSn;
        });
        $(document).on("click", "#btnUpdateExprn", function (e) {

            let urlParams = new URL(location.href).searchParams;
            let exprnSeq = urlParams.get('exprnSeq');
            let exprnSn = urlParams.get('exprnSn');
            location.href = "experienceUpdt.html?exprnSeq=" + exprnSeq + '&exprnSn=' + exprnSn;
        });

        $(document).on("click", "#exprnParticipantsNum", function (e) {
            $("#exprnFxParticipantsContent").removeClass("visibil");
        });
     
    }
// 특정 행의 상태를 가져오는 함수
, getStatus: (index) =>{
    return statuses[index];
}

// 특정 행의 상태를 설정하는 함수
,setStatus: (index, status) =>{
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
    getUrlParams: () => {
        const urlParams = new URL(location.href).searchParams;
        return {
            exprnSeq: urlParams.get('exprnSeq'),
            exprnSn: urlParams.get('exprnSn')
        };
    }
    ,
getExperienceFxDetail  : async() =>{
        let urlParams = new URL(location.href).searchParams;
        let exprnSn = urlParams.get('exprnSn');
        let exprnSeq = urlParams.get('exprnSeq');
        const paramMap = { 'exprnSeq': exprnSeq, 'exprnSn': exprnSn };

        const res = await event.sendAjaxRequest("/experience/selectExperienceOperate.api", paramMap);
        let resData = res.data; 
       vm.exprnData = res.data
                if (resData.canclNtcnArray != null) {
                    vm.exprnData.canclNtcnArray = resData.canclNtcnArray.split(',')
                } else {
                    vm.exprnData.canclNtcnArray = []
                }

		//console.log(res)
		//console.log(resData)
        await event.setExperience(resData);
        await event.setExperienceFx(resData); 

        const ExperienceFxParticipantsListRes = await event.sendAjaxRequest("/experience/selectExperienceParticipantsList.api", paramMap);
        await event.setExperienceParticipants(ExperienceFxParticipantsListRes.data);

        const ExperienceUserRes = await event.sendAjaxRequest("/experience/selectExperienceUserList.api", paramMap);
        await event.setExperienceUser(ExperienceUserRes.data);
    
		//console.log(ExperienceFxParticipantsListRes.data)
		//console.log(ExperienceUserRes.data)
    
    vm.exprnUserArrayList = ExperienceUserRes.data;

    } 
	,setExperience : (resData) =>{
		
        //console.log(resData);

        const {
            exprnKndCode, exprnPlaceNm, exprnWeekArray, exprnBeginDate, exprnEndDate,
            exprnCo, canclDc, canclNtcnArray, exprnKndCodeStr, exprnSttusSe,
            exprnSeq,exprnSn, rcritBeginDate, rcritBeginHour, rcritBeginMinutes,
            rcritEndDate, rcritEndHour, rcritEndMinutes
        } = resData;

        Object.assign(vm.exprnData, {
            exprnKndCode, exprnPlaceNm, exprnBeginDate, exprnEndDate,
            exprnDescription: canclDc, canclNtcnArray,
            exprnKndCodeStr, exprnSttusSe, exprnSeq, rcritBeginDate,
            rcritBeginHour, rcritBeginMinutes, rcritEndDate, rcritEndHour, rcritEndMinutes
        });

        vm.exprnData.exprnWeekArray = exprnWeekArray === "" ? exprnWeekArray.split(',') : exprnWeekArray || [];
        vm.exprnData.exprnCo = exprnCo !== "" ? exprnCo : 0;
		
        let paramMap = {'exprnSeq': exprnSeq, 'exprnSn':exprnSn};
      
   
	}  
   , 
    setExperienceFx: (resData) => {
		//console.log(resData)
        //console.log(resData);

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
    } ,
    setExperienceUser: (resData) => {
		//console.log(resData)
        let ExprnCancelButtonTag = "<div class='pr-5'>  <a id='btnCancelExprn' href='#' class='btn btn-orange btn-icon btn_search_width' ><span class='text'>체험예약 취소</span>  </a></div>"
        let ExprnUpdateButtonTag = "<div class='pr-5'>  <a id='btnUpdateExprn' href='#'  class='btn btn-primary btn-icon btn_search_width' ><span class='text'>수정</span>  </a></div>"


        if (resData.length > 0 && resData[0].exprnSeq === vm.exprnData.exprnSeq) {
            vm.exprnData.exprnRegisterCnt = resData.length;
            $("#getExprnCancelButtonTag").append(ExprnCancelButtonTag);
        } else {
            vm.exprnData.exprnRegisterCnt = '0';
            $("#getExprnUpdateButtonTag").append(ExprnUpdateButtonTag);
        }

        vm.exprnData.exprnRegisterCnt = vm.exprnData.exprnRegisterCnt || 0;
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
            //console.log(exprnRegisterInfo);
            vm.exprnData.exprnRegisterInfo = exprnRegisterInfo;

            const userInfoString = `${exprnUserSeq}(${userNm})(${psitnNm})(${userInnb})`;

            // User Author condition
            const allowedAuthors = ['ST', 'TJ', 'FF', 'ETA', 'ETB', 'ETC', 'G'];
            if (allowedAuthors.includes(userData.userAuthor)) {
                vm.exprnData.exprnUserArray.push(userInfoString);
            }
        }
    }
        ,  
    setExperienceParticipants: (resData) => {
		//console.log(resData)
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
            vm.exprnData.tudentNameUSer = data.userNm;
            vm.exprnData.psitnNmUSer = data.psitnNm;
            vm.exprnData.userAuthorUser = data.useAuthor;
            vm.exprnData.exprnSn = data.exprnSn;
            vm.exprnData.exprnParticipantInfo = formatParticipantInfo(data);
    
            // 특정 userAuthor 값에 따라 배열에 정보 추가
            if (['ST', 'TJ', 'FF', 'ETA', 'ETB', 'ETC', 'G'].includes(data.userAuthor)) {
                vm.exprnData.exprnParticipantUserArray.push(formatParticipantInfo(data));
            }
        });
    } 
};

 



$(document).ready(() => {
	vueInit(); 
    event.init(); 
    event.getExperienceFxDetail();
    
});




