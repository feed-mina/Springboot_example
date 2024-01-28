let vueData = {
  totalCount: 0,
  vodList: [],
  searchData: {
    // closedLctreInclude: false,
    // authorOne: "",
    searchText: '',
    pageNo: 1,
	pageLength: 10,
	vodYn:"Y"
  }
};

let dataPerPage = 10;
let pagePerBar = 10;
let pageCount = 10;
let vm;

let vueInit = () => {
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
        event.selectVodListPaging();
      },
      fnDetail : event.fnDetail,
      ellipsisText: (text) => {
        return util.formmater.textLengthOverCut(text, null, null);
      }
    }
  })
  vm = app.mount("#content");
};

let event = {

  selectVodListPaging : () =>{
    $.sendAjax({
      url: "/vodController/selectVodListPaging.api",
      data: vm.searchData,
      contentType: "application/json",
      success: (res) => {
        console.log("🚀 ~ res:", res);
        vm.totalCount = res.data.totalCount;
        vm.vodList = res.data.list;
        let len = vm.vodList.length;

        //강의요일 글자로 변환
        // for(let i=0; i<len; i++) {
        //   let lctreWeekArrayStr = vm.vodList[i].lctreWeekArray;
        //   lctreWeekArrayStr = lctreWeekArrayStr.replace("1", "월")
        //     .replace("2", "화")
        //     .replace("3", "수")
        //     .replace("4", "목")
        //     .replace("5", "금")
        //     .replace("6", "토")
        //     .replaceAll(", ", "/");
        //   vm.vodList[i].lctreWeekArray = lctreWeekArrayStr;
        // }

        //회원종류 글자로 변환
        for(let i=0; i<len; i++) {
          let atnlcAuthorArrayStr = vm.vodList[i].atnlcAuthorArray;
          atnlcAuthorArrayStr = atnlcAuthorArrayStr.replace("ALL", "전체")
              .replace("ETA", "중고생")
              .replace("ETB", "초등생")
              .replace("ETC", "지역주민")
              .replace("FF", "교직원")
              .replace("ST", "순천향대학생")
              .replace("TJ", "텐진외대학생")
              .replaceAll(", ", "/");
          vm.vodList[i].atnlcAuthorArrayStr = atnlcAuthorArrayStr;
        }

		//강의일 포맷 맞춤
		for(let i=0; i<len; i++) {
			let trgetDtStr = vm.vodList[i].trgetDt;
			trgetDtStr = util.date.addDateDash(trgetDtStr);
			vm.vodList[i].trgetDt = trgetDtStr;
		}

        fnPaging(res.data.totalCount, dataPerPage, pageCount, res.data.pageNo, (selectPage) => {
          vm.searchData.pageNo = selectPage;
          event.selectVodListPaging();
        })
      }
      ,error: function (e) {
        $.alert(e.responseJSON.message);
      }
    });
  },
  fnDetail : (lctreSeq)   => {
    location.href="lctreDetail.html?lctreSeq=" + lctreSeq;
  },
}

$(document).ready(() => {
  vueInit();
//   util.tableSetting();
  event.selectVodListPaging();
});
