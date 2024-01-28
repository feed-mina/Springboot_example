var vueData = {
	totalCount: 0,
	faqList : [],
	cmmnCode : [],
	searchData: {
		bbsCode : 'FAQ',
		bbsSe : '',
		searchText: '',
    pageNo: 1,
    pageLength: 10
	}
}

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
			fnSearch: function (cmmnCodeEtc) {
    		this.searchData.pageNo = 1;
    		if(util.emptyCheck(cmmnCodeEtc) !== ''){
					vm.searchData.bbsSe = cmmnCodeEtc;
				}else{
					vm.searchData.bbsSe = ''
				}
    		event.getFaqList();
  		},
  		fnDtail : (bbsSeq) => {
			  location.href="faqDetail.html?bbsSeq=" + bbsSeq
		  }
		}
	})
	vm = app.mount("#content");
}

var event = {
	getCmmnCodeList : () => {
		let param = {
			upperCmmnCode : 'BBS'
		}
		$.sendAjax({
			url: "/cmmn/selectCmmnCode.api",
			data: param,
			contentType: "application/json",
			success : (res) => {
				vm.cmmnCode = res.data;
			}			
		})
	},
	
	getFaqList : () => {
		$.sendAjax({
	    url: "/board/selectFaqList.api",
	    data: vm.searchData,
			contentType: "application/json",
	      success: (res) => {
			  vm.totalCount = res.data.totalCount;
				vm.faqList = res.data.list;
				fnPaging(res.data.totalCount, dataPerPage, pageCount, res.data.pageNo, (selectPage) => {
					vm.searchData.pageNo = selectPage;
					event.getFaqList();
				})
			}
	        ,error: function (e) {
	        	$.alert(e.responseJSON.message);
	        }
	    });
	}	
	
}

$(document).ready(() => {
	vueInit();
	event.getCmmnCodeList();
  event.getFaqList();
})