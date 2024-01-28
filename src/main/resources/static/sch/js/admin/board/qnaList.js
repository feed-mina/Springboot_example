var vueData = {
	totalCount: 0,
	qnaList : [],
	cmmnCode : [],
	searchData: {
		bbsCode: 'QNA',
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
    		event.getQnaList();
  		},
  		fnDtail : event.fnDtail
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
	
	getQnaList : () => {
		$.sendAjax({
	    url: "/board/selectQnaList.api",
	    data: vm.searchData,
			contentType: "application/json",
	      success: (res) => {
			  vm.totalCount = res.data.totalCount;
				vm.qnaList = res.data.list;
				fnPaging(res.data.totalCount, dataPerPage, pageCount, res.data.pageNo, (selectPage) => {
					vm.searchData.pageNo = selectPage;
					event.getQnaList();
				})
			}
	        ,error: function (e) {
	        	$.alert(e.responseJSON.message);
	        }
	    });
	},
	
	fnDtail : (bbsSeq, cnt) => {
		if(cnt === 0) {
			location.href="qnaRegist.html?bbsSeq=" + bbsSeq
		}else{
			location.href="qnaDetail.html?bbsSeq=" + bbsSeq
		}
	}
	
}

$(document).ready(() => {
	vueInit();
	event.getCmmnCodeList();
  event.getQnaList();
})