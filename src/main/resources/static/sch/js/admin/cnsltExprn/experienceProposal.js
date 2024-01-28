var vueData = {
	imageButton: "false",
	step: "master",
	totalCount: 0,

	modifyData: {},
	otherExprnProposal:{},
	otherExprnProposalList : [],
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
				event.getExprnProposalList();
			} 

    ,fnDtail: (bbsSeq) => {
			let exprnSeq =vm.otherExprnProposal.bbsSeq
				 location.assign("/sch/admin/cnsltExprn/experienceProposalDetail.html?bbsSeq=" + bbsSeq)
			}  

		}
	})
	vm = app.mount("#content");

};
 let  event = {
	init: () => {
	}
	, getExprnProposal: () => {
		$.sendAjax({
			url: "/experience/getExprnProposal.api",
			data: vm.otherExprnProposal,
			contentType: "application/json",
			success: (res) => {
				//console.log(res.data) 
				vm.otherExprnProposal.bbsSeq  = res.data.bbsSeq
				vm.otherExprnProposal.exprnProposalCn = res.data.exprnProposalCn
				vm.otherExprnProposal.exprnProposalCode = res.data.exprnProposalCode
				vm.otherExprnProposal.exprnProposalSj = res.data.exprnProposalSj
				vm.otherExprnProposal.exprnProposalSe = res.data.exprnProposalSe
				vm.otherExprnProposal.useAt	  = res.data.useAt
				vm.otherExprnProposal.userId	 = res.data.userId 
				vm.otherExprnProposal.registDt	 = res.data.registDt 
				vm.otherExprnProposal.otherProposalStr	 = res.data.otherProposalStr 
			
			}
			, error: function(e) {
				$.alert(e.responseJSON.message);
			}
		});
	}
	, getExprnProposalList: () => {
		
		$.sendAjax({
			url: "/experience/getExprnProposalList.api",
			// url : "experience/selectExprienceList.api"
			data: vm.searchData,
			contentType: "application/json",
			success: (res) => {
				//console.log(res.data.list) 
				vm.totalCount = res.data.totalCount;
				vm.otherExprnProposalList = res.data.list;
				vm.otherExprnProposalList.bbsSeq  = res.data.bbsSeq
				vm.otherExprnProposalList.exprnProposalCn = res.data.exprnProposalCn
				vm.otherExprnProposalList.exprnProposalCode = res.data.exprnProposalCode
				vm.otherExprnProposalList.exprnProposalSj = res.data.exprnProposalSj
				vm.otherExprnProposalList.exprnProposalSe = res.data.exprnProposalSe
				vm.otherExprnProposalList.useAt	  = res.data.useAt
				vm.otherExprnProposalList.userId	 = res.data.userId 
				vm.otherExprnProposalList.registDt	 = res.data.registDt 
				vm.otherExprnProposalList.otherProposalStr	 = res.data.otherProposalStr 
				// 페이지
				fnPaging(res.data.totalCount, dataPerPage, pageCount, res.data.pageNo, (selectPage) => {
					vm.searchData.pageNo = selectPage;
					event.getExprnProposalList();
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
	event.getExprnProposal();
	event.getExprnProposalList();
});

