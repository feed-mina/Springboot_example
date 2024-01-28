var vueData = {
	imageButton: "false",
	step: "master",
	totalCount: 0,

	modifyData: {},
	exprnList: [],
	searchData: {
		searchText: '',
		pageNo: 1,
		pageLength: 10,
	},
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
			fnSearch: function(userAuthor) {
				this.searchData.pageNo = 1;
				event.getExprnList();
			},
			fnDtail: (exprnSeq) => {
				 location.assign("/sch/admin/cnsltExprn/experienceDetail.html?exprnSeq=" + exprnSeq)
			}  
		}
	})
	vm = app.mount("#content");

};
let event = {
	init: () => {
	}
	, getExprnList: () => {
		$.sendAjax({
			url: "/experience/selectExperienceList.api",
			data: vm.searchData,
			contentType: "application/json",
			success: (res) => {
				vm.totalCount = res.data.totalCount;
				vm.exprnList = res.data.list;
				for (var i = 0; i < vm.exprnList.length; i++) {
					
					if(vm.exprnList[i].exprnNm.length>= 8){
    					vm.exprnList[i].exprnNm = vm.exprnList[i].exprnNm.substring(0, 8) + '...';
						 
					}
					
				// 요일변환 numToDay(obj)
					let day = []
					if (vm.exprnList[i].exprnWeekArray !== "") {
						day = vm.exprnList[i].exprnWeekArray.split(',');
						
                let resData = res.data;   
                 //console.log(resData.list) 
                //console.log(resData) 
						let dayname = Object.fromEntries(
							Object.entries(day).map(([key, value]) =>
								[key, value])
						);
						var dvalue = Object.values(dayname);

						let name = dvalue.map(dayname => {
							if (Object.values(dayname) == 1) {
								return "월";
							} if (Object.values(dayname) == 2) {
								return "화";
							} if (Object.values(dayname) == 3) {
								return "수";
							} if (Object.values(dayname) == 4) {
								return "목";
							} if (Object.values(dayname) == 5) {
								return "금";
							} if (Object.values(dayname) == 6) {
								return "토";
							}
							return "오류";
						})
						vm.exprnList[i].exprnWeekArray = name;
					    vm.exprnList[i].exprnWeekArray = Object.values(vm.exprnList[i].exprnWeekArray).toString().replaceAll(",", "/");
					}
					let exprnKndCode = "";
					exprnKndCode = vm.exprnList[i].exprnKndCode
					switch (exprnKndCode) {
					case 'W': exprnKndCode = '서예 체험';
						break;
					case 'T': exprnKndCode = '차 체험';
						break;
					case 'C': exprnKndCode = '도장 체험';
						break;
					case 'S':exprnKndCode = '향 체험';
						break;
				}
				vm.exprnList[i].exprnKndCode = exprnKndCode;	
				}
				// 페이지
				fnPaging(res.data.totalCount, dataPerPage, pageCount, res.data.pageNo, (selectPage) => {
					vm.searchData.pageNo = selectPage;
					event.getExprnList();
				})
			}
			, error: function(e) {
				$.alert(e.responseJSON.message);
			}
		});
	}
};

$(document).ready(() => {
	vueInit();
	event.getExprnList();
});

