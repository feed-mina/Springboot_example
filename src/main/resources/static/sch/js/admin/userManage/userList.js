var vueData = {
  totalCount: 0,
  userList: [],
  cmmnCode : [],
  searchData: {
	  guestAuthor: false,
	  useAt: false,
	  authorOne: "",
	  searchText: '',
    pageNo: 1,
    pageLength: 10
  }
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
				getCmmnCodeList : () => {
					let param = {
						upperCmmnCode : 'AUTHOR'
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
		    fnSearch: function (userAuthor) {
      		vm.searchData.pageNo = 1;
      		if(userAuthor !== ''){
						vm.searchData.authorOne = userAuthor;
					}
      		vm.getUserList();
    		},
    		
    		getUserList : () =>{
					$.sendAjax({
				    url: "/userManage/selectUserList.api",
				    data: vm.searchData,
						contentType: "application/json",
				      success: (res) => {
							  vm.totalCount = res.data.totalCount;
							  vm.userList = res.data.list;
							  if(res.data.list.length){
								  for(let i=0; i<res.data.list.length; i++){
									  if(res.data.list[i].mbtlnum !== null){
										  vm.userList[i].mbtlnum = util.formmater.phone(res.data.list[i].mbtlnum);
									  }
									  
									  if(res.data.list[i].mktStplat){
										  var befMonth = new Date(res.data.list[i].mktStplat);
										  befMonth.setFullYear(befMonth.getFullYear()+5);
										  var now = new Date();
										  var mktUseAt = Math.floor((befMonth.getTime() - now.getTime())/(1000*60*60*24));
										  vm.userList[i].mktUseAt = mktUseAt;
									  }
									  if(res.data.list[i].psitnNm){
										  let psitnNm1 = res.data.list[i].psitnNm.split('/');
										  vm.userList[i].psitnNm1 = psitnNm1[0];
										  if(psitnNm1[1]){
											  vm.userList[i].psitnNm2 = psitnNm1[1];
										  }
									  }
								  }
							  }
								fnPaging(res.data.totalCount, dataPerPage, pageCount, res.data.pageNo, (selectPage) => {
									vm.searchData.pageNo = selectPage;
									vm.getUserList();
								})
							}
			        ,error: function (e) {
			        	$.alert(e.responseJSON.message);
			        }
				    });
				},
    		
      	fnDtail : (userSeq) => {
				  location.href="userDetail.html?userSeq=" + userSeq
			  }
		}
	})
	vm = app.mount("#content");
};

let event = {
	
}

$(document).ready(() => {
	vueInit();
  vm.getCmmnCodeList();
  vm.getUserList();
});