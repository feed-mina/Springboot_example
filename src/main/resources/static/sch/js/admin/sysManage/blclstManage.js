var vueData = {
	totalCount: 0,
	userList: [],
	// cmmnCode : [],
	searchData: {
	  searchText: '',
	  pageNo: 1,
	  pageLength: 10,
	  userType: "user"
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
		fnSearch: function (userAuthor) {
		  this.searchData.pageNo = 1;
		  events.getBlclstList();
		},
		fnDtail : (trgetUserSeq, userSeq, registDt) => {
		//   location.href="mberDetail.html?userSeq=" + userSeq + "&flag=mber";
		  let url = "blclstDetail.html?userSeq=" + userSeq ;
		  url += "&trgetUserSeq=" + trgetUserSeq;
		  url += "&registDt=" + registDt;
		  
		  location.href = url;
		},
		userRegistRedirect : () => {
		  window.open("/sch/admin/login/register.html", "_blank");
		}
	  }
	})
	vm = app.mount("#content");
  };
  
  var events = {
	getBlclstList : () =>{
	  console.log(vm.searchData)

	  /**
	   * searchText: "검색어"
	   * 
	   */
	  $.sendAjax({
		url: "/sysManage/selectMberBlclstPaging.api",
		data: vm.searchData,
		contentType: "application/json",
		success: (res) => {
		  vm.totalCount = res.data.totalCount;
		  vm.userList = res.data.list;
		  fnPaging(res.data.totalCount, dataPerPage, pageCount, res.data.pageNo, (selectPage) => {
			vm.searchData.pageNo = selectPage;
			events.getBlclstList();
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
	events.getBlclstList();
	// util.tableSetting();
	/*vm.getCmmnCodeList();*/
  });