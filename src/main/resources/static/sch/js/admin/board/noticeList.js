var vueData = {
  totalCount: 0,
  noticeList: [],
  
  searchData: {
	  bbsCode : 'NOTICE',
	  searchText: '',
    pageNo: 1,
    pageLength: 10
  }
};

let dataPerPage = 10;
let pagePerBar = 10;
let pageCount = 10;
var vm;

var oEditors = [];

var vueInit = () => {
  	const app = Vue.createApp({
	    data() {
	    	return vueData;
	    },
	    methods: {
		    fnSearch: function () {
        		this.searchData.pageNo = 1;
        		event.getNoticeList();
      		},
      	fnDtail : event.fnDtail,
      	sortBbsSj: () => {
			  	vm.noticeList.sort(function(a,b){
					  return a.vm.noticeList.bbsSj(b.vm.noticeList)
				  })
		  	}
			}
	})
	vm = app.mount("#content");
};

var event = {
	
	getNoticeList : () =>{
		$.sendAjax({
	    url: "/board/selectNoticeList.api",
	    data: vm.searchData,
			contentType: "application/json",
	      success: (res) => {
			  vm.totalCount = res.data.totalCount;
				vm.noticeList = res.data.list;
				fnPaging(res.data.totalCount, dataPerPage, pageCount, res.data.pageNo, (selectPage) => {
					vm.searchData.pageNo = selectPage;
					event.getNoticeList();
				})
			}
	        ,error: function (e) {
	        	$.alert(e.responseJSON.message);
	        }
	    });
	},
	
	fnDtail : (bbsSeq) => {
		location.href="noticeDetail.html?bbsSeq=" + bbsSeq
	}
	
}

$(document).ready(() => {
	vueInit();
  event.getNoticeList();
});