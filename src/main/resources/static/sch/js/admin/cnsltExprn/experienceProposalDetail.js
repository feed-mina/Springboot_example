var vueData = {
    imageButton: "false",
    step: "master",
    totalCount: 0,

    modifyData: {},
    otherExprnProposal: {},
    otherExprnProposalList: [],
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
            fnSearch: function (userAuthor) {
                this.searchData.pageNo = 1;
                event.getExprnList();
            },



        }
    })
    vm = app.mount("#content");

};
let event = {
    init: () => {
    }
    , getExprnProposal: () => {
        let urlParams = new URL(location.href).searchParams;
        let bbsSeq = urlParams.get('bbsSeq');
        //console.log(bbsSeq)
        let paramMap = { 'bbsSeq': bbsSeq };
        $.sendAjax({
            url: "/experience/getExprnProposal.api",
            data: paramMap,
            contentType: "application/json",
            success: async (res) => {
                let resData = res.data;
                //console.log(res.data)
                await event.setExprnProposal(resData);

            }
            , error: function (e) {
                $.alert(e.responseJSON.message);
            }
        });
    },
    setExprnProposal : (resData) =>{
		
                vm.otherExprnProposal.bbsSeq = resData.bbsSeq
                vm.otherExprnProposal.exprnProposalCn = resData.exprnProposalCn
                vm.otherExprnProposal.exprnProposalCode = resData.exprnProposalCode
                vm.otherExprnProposal.exprnProposalSj = resData.exprnProposalSj
                vm.otherExprnProposal.exprnProposalSe = resData.exprnProposalSe
                vm.otherExprnProposal.useAt = resData.useAt
                vm.otherExprnProposal.userId = resData.userId
                vm.otherExprnProposal.registDt = resData.registDt
                vm.otherExprnProposal.otherProposalStr = resData.otherProposalStr
	}
};

$(document).ready(() => {
    vueInit();
    util.tableSetting();
    event.getExprnProposal();
});

