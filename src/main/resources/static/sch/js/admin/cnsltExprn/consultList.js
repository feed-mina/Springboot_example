var vueData = {
	imageButton: "false",
	step: "master",
	totalCount: 0,

	modifyData: {},
	cnsltList: [],
	searchData: {
		searchText: '',
		pageNo: 1,
		pageLength: 10,
	},
	cnsltTimeList: {}
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
				event.getCnsltList();
			},
			fnDtail: (cnsltSeq) => {
				 location.assign("/sch/admin/cnsltExprn/consultDetail.html?cnsltSeq=" + cnsltSeq)
			},

		}
	})
	vm = app.mount("#content");

};
 let  event = {
	init: () => {
		
	}
	, getCnsltList: () => {
		$.sendAjax({
			url: "/consult/selectConsultList.api",
			data: vm.searchData,
			contentType: "application/json",
			success: (res) => {
				vm.totalCount = res.data.totalCount;
				vm.cnsltList = res.data.list;
				
				console.log(res.data)
				console.log(res.data.list)
				for (var i = 0; i < vm.cnsltList.length; i++) {
				// 글자가 8글자 이상일때 ...
					if(vm.cnsltList[i].cnsltNm.length>= 8){
    					vm.cnsltList[i].cnsltNm = vm.cnsltList[i].cnsltNm.substring(0, 8) + '...';
						 
				console.log(vm.cnsltList[i].cnsltNm.length)
					}
					
				// 요일변환 numToDay(obj)
					let day = []
					if (vm.cnsltList[i].cnsltWeekArray !== "") {
						day = vm.cnsltList[i].cnsltWeekArray.split(',');

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
						vm.cnsltList[i].cnsltWeekArray = name;
						vm.cnsltList[i].cnsltWeekArray = Object.values(vm.cnsltList[i].cnsltWeekArray).toString().replaceAll(",", "/");

					}
				}
				// 페이지
				fnPaging(res.data.totalCount, dataPerPage, pageCount, res.data.pageNo, (selectPage) => {
					vm.searchData.pageNo = selectPage;
					event.getCnsltList();
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
	event.getCnsltList();
});

