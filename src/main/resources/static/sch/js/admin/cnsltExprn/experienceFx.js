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
	
	exprnOperateList : [],
	imageButton: "false",
	step: "master",
	exprnUserSeq: 0,
	totalCount: 0, 
    preview:"",
	exprnFx : {},
	modifyData: {},
	exprnList: [],
	searchData: {
        canceldExprnInclude: false,
		searchText: '',
		pageNo: 1,
		pageLength: 10,
	},
	canceldExprnInclude : '',
};

let dataPerPage = 10;
let pagePerBar = 10;
let pageCount = 10;
var vm;

var vueInit = () => {
	const app = Vue.createApp({
		data() {
			return vueData;
		},
		methods: {
			fnSearch: function(cmmnCodeEtc) {
				this.searchData.pageNo = 1;
		   
				event.getExprnList();
			} 
            , fnExperienceOperationDetail: (exprnSeq, exprnSn) => {
				 location.assign("/sch/admin/cnsltExprn/experienceOperateDetail.html?exprnSeq=" + exprnSeq+"&exprnSn="+exprnSn)
            }   
		}
	})
	vm = app.mount("#content");

};
 let  event = {
	init: () => {  
        let canceldExprnIncludeCheckbox = document.querySelector("#canceldExprnInclude");
        canceldExprnIncludeCheckbox.addEventListener("change", () => {
            if (canceldExprnIncludeCheckbox.checked) {
                vm.searchData.canceldExprnInclude = true; // 운영취소 포함
            } else {

                vm.searchData.canceldExprnInclude = false; // 운영취소 포함안됨
            }
        })
	} 
	,getExprnList : async() =>{
       $.sendAjax({
            url: "/experience/selectExprnOperateList.api",
            data: vm.searchData,
            contentType: "application/json",
            success: (res) => {
                const { totalCount, list, pageNo } = res.data;
				vm.exprnList.exprnRegisterCnt2 = 	vm.exprnList.exprnRegisterCnt + vm.exprnList.experienceUserCnt 
         	console.log(res.data)
                vm.totalCount = totalCount;
                vm.exprnList = list.map(item => {
                    const { exprnWeekArray, exprnKndCode , exprnDay, exprnRegisterCnt, experienceUserCnt } = item;
 	        
                    if (exprnWeekArray !== "") {
                        const dayNames = ["월", "화", "수", "목", "금", "토", "일"];
                        const dayIndices = exprnWeekArray.split(',').map(Number);

                        item.exprnWeekArray = dayIndices.map(index => dayNames[index - 1] || "오류").join("/");
                    }
                    item.exprnKndCode = exprnKndCode;
                    item.experienceUserCnt = experienceUserCnt
                    item.exprnRegisterCnt = exprnRegisterCnt
                    item.experienceUserCount = item.exprnRegisterCnt + item.experienceUserCnt  
         			item.exprnDay =  exprnDay
                    
         			vm.exprnList.experienceUserCount = 	item.experienceUserCount
   
                    return item;
                });
			     fnPaging(totalCount, dataPerPage, pageCount, pageNo, (selectPage) => {
                    vm.searchData.pageNo = selectPage;
                    event.getExprnList();
                });
            },
            error: (e) => {
                $.alert(e.responseJSON.message);
            }
        });
    }
     
};

$(document).ready(() => {
	vueInit();
	event.getExprnList();
    event.init(); 
});

