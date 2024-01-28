var vueData = {
  totalCount: 0,
  userList: [],
  cmmnCode : [],
  searchData: {
    useCert: false,
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
      fnSearch: function (userAuthor) {
        this.searchData.pageNo = 1;
        if(userAuthor !== ''){
          vm.searchData.authorOne = userAuthor;
        }
        event.getUserList();
      },
      fnDtail : (userSeq) => {
        location.href="mberDetail.html?userSeq=" + userSeq
      }
    }
  })
  vm = app.mount("#content");
};

var event = {

  getUserList : () =>{
    $.sendAjax({
      url: "/sysManage/selectConectHistList.api",
      data: vm.searchData,
      contentType: "application/json",
      success: (res) => {
        vm.totalCount = res.data.totalCount;
        vm.userList = res.data.list;
        if(res.data.list.length){
          for(let i=0; i<res.data.list.length; i++){
            if(res.data.list[i].psitnNm){
              let psitnNm1 = res.data.list[i].psitnNm.split('/');
              vm.userList[i].psitnNm1 = psitnNm1[0];
              if(psitnNm1[1]){
                vm.userList[i].psitnNm2 = psitnNm1[1];
              }
            }
            vm.userList[i].loginTimeDiff = util.mToHi(res.data.list[i].loginTimeDiff)
            vm.userList[i].mbtlnum = res.data.list[i].mbtlnum ? util.formmater.phone(res.data.list[i].mbtlnum) : null;
          }
        }

        fnPaging(res.data.totalCount, dataPerPage, pageCount, res.data.pageNo, (selectPage) => {
          vm.searchData.pageNo = selectPage;
          event.getUserList();
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
  util.tableSetting();
  /*vm.getCmmnCodeList();*/
  event.getUserList();
});