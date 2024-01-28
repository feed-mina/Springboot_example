var vueData = {
	userDetail :{},
	lctreList : [],
	lctreCnclList : [],
	lctreCnclUpdt : {},
	btnRe : false
}

var vm;

var vueInit = () => {
	const app = Vue.createApp({
		data() {
			return vueData;
		},
		methods: {
			userOneLctreList: () => {
				const urlParams = new URL(location.href).searchParams;
				let param = {
					userSeq : urlParams.get('userSeq')
				}
				$.sendAjax({
					url: "/userManage/selectUserOneLctreList.api",
					data : param,
					contentType: "application/json",
					success : (res) => {
						vm.userDetail = res.data;
						if(res.data.lctreList){
							vm.lctreList = res.data.lctreList;
							for(var i=0; i<res.data.lctreList.length; i++){
								vm.lctreList[i].lctreBeginDe = util.date.addDateDash(res.data.lctreList[i].lctreBeginDe);
								vm.lctreList[i].lctreEndDe = util.date.addDateDash(res.data.lctreList[i].lctreEndDe);
							}
						}
					}			
				})
			},
			fnLctreCncl: (lctreSeq, idx) => {
				vm.lctreCnclList.push(lctreSeq);
				$('#cnclAdd'+idx).hide();
				$('#cnclRe'+idx).show();
			},
			fnLctreRe: (lctreSeq, idx) => {
				for(var i = 0; i < vm.lctreCnclList.length; i++) {
			    if (vm.lctreCnclList[i] === lctreSeq) {
						vm.lctreCnclList.splice(i, 1);
						i--
			    }
				}
				$('#cnclAdd'+idx).show();
				$('#cnclRe'+idx).hide();
			},
			fnLctreReset: () => {
				if(vm.lctreCnclList.length === 0){
					$.alert("신청 취소할 목록이 없습니다.")
				}
				if(vm.lctreCnclList.length > 0){
					$.confirm("신청 취소할 목록을 초기화 하시겠습니까?", () => {
						vm.lctreCnclList = []
						$('.cnclAdd').show()
						$('.cnclRe').hide()
					})
				}
			},
			fnLctreCnclUpdt:() => {
				$.confirm("정말 신청 취소를 저장하시겠습니까? 저장 이후에는 변경이 되지 않습니다.", ()=> {
					if(!vm.lctreCnclList.length){
						$.alert("신청 취소할 강의를 선택해 주세요.");
						return false;
					}
					
					let param = {
						userSeq : vm.userDetail.userSeq,
						lctreCnclList : vm.lctreCnclList
					}
					$.sendAjax({
						url: "/userManage/updateLctreCancl.api",
						data : param,
						contentType: "application/json",
						success : (res) => {
							$.confirm("저장이 완료되었습니다.", () =>{
								location.href="userDetail.html?userSeq=" + vm.userDetail.userSeq
							})
						}			
					})
				})
			},
			fnLctreDetail: (lctreSeq) => {
				detailModal(lctreSeq)
			}
		}
	})
	vm = app.mount('#content');
}

var event = {
	
	
}


$(document).ready( () => {
	vueInit();
	vm.userOneLctreList();
})

