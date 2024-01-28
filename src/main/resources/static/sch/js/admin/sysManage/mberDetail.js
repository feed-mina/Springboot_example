let vueData = {
  mberDetail: {},
  mberBlclst: [],
  urlParams: "",
}

let vm;

let vueInit = () => {
  const app = Vue.createApp({
    data() {
      return vueData;
    },
    methods: {
	  util: () => window.util,
	  fnUpgradeMber: (userSeq) => {
		let param = {
			userSeq: this.urlParams.get('userSeq'),
		}
		$.sendAjax({
            url: "/login/userUpgradeConfirm.api",
            data: param,
            contentType: "application/json",
            success: (res) => {
              $.confirm("업데이트가 정상적으로 되었습니다.", () => {
                window.location.href = window.location.href;
              })
            }
          })
      },
      fnUpdtMber: (userSeq) => {
        console.log(userSeq);
        location.href = "mberUpdt.html?userSeq=" + userSeq + "&flag=" + this.urlParams.get('flag');
      },
      fnDelMber: () => {
        let param = {
          userSeq: this.urlParams.get('userSeq'),
          useAt: "D"
        }

        $.confirm("정말 탈퇴처리 하시겠습니까? 관리자, 회원 정보가 모두 사라집니다.", () => {
          $.sendAjax({
            url: "/user/updateMberUseAt.api",
            data: param,
            contentType: "application/json",
            success: (res) => {
              $.confirm("탈퇴처리가 정상적으로 되었습니다.", () => {
                window.location.href = "/sch/admin/sysManage/mberManage.html";
              })
            }
          })
        })
      },
    }
  })
  vm = app.mount("#content");
};

let event = {
  mberDetailOne: () => {
    let _this = this;
    console.log(this.urlParams);
    let param = {
      userSeq: this.urlParams.get('userSeq'),
      flag: this.urlParams.get('flag')
    }

    $.sendAjax({
      url: "/sysManage/selectMberOneDetail.api",
      data: param,
      contentType: "application/json",
      success: (res) => {
        vm.mberDetail = res.data;
        var befMonth = new Date(res.data.userStplat);
        let title = param.flag === "admin" ? "관리자 계정 관리 상세" : "일반회원 관리 상세";
        $("#pageTitle").text(title);

        befMonth.setFullYear(befMonth.getFullYear() + 5);
        var now = new Date(util.date.addDateDash(util.date.getToday()));
        var reStplat = (befMonth.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
        vm.mberDetail.reStplat = reStplat;
        if (res.data.psitnNm) {
          let psitnNm1 = res.data.psitnNm.split('/');
          vm.mberDetail.psitnNm1 = psitnNm1[0];
          if (psitnNm1[1]) {
            vm.mberDetail.psitnNm2 = psitnNm1[1];
          }
        }
        vm.mberDetail.mbtlnum = res.data.mbtlnum ? util.formmater.phone(res.data.mbtlnum) : null;
      }
    })
  },
  selectMberBlclst: () => {
    let param = {
	  trgetUser: this.urlParams.get('userSeq')
    }

    $.sendAjax({
      url: "/sysManage/selectMberBlclstPaging.api",
      data: param,
      contentType: "application/json",
      success: (res) => {
        vm.mberBlclst = res.data.list;
        vm.mberBlclst.mberBlclstCnt = vm.mberBlclst.length;
      }
    })
  }
}

$(document).ready(() => {
  this.urlParams = new URL(location.href).searchParams;
  vueInit();
  event.mberDetailOne();
  event.selectMberBlclst();

})
