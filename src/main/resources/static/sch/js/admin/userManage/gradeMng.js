var vueData = {
  totalCount: 0,
  userList: [],
  cmmnCode : [],
  gradeList : [],
  gradeCode : '',
  searchData: {
	  searchText: '',
	  authorOne: "",
    sDate: ''
  },
  months : [],
  cDate: '',
  chkDate:'',
  chkDay: util.date.getToday(),
  selDisalbed: true
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
				fnAuthor: (userAuthor) => {
					vm.searchData.authorOne = userAuthor;
					vm.fnSearch()
				},
		    fnSearch: () => {
      		vm.searchData.pageNo = 1;
					
					if(vm.cDate === '') {
						vm.cDate  = util.lastMonth()
						vm.chkDate = vm.cDate
					}
					vm.searchData.sDate = vm.cDate + '-01'
					vm.getMonths()
      		$.sendAjax({
				    url: "/userManage/selectUserGradeList.api",
				    data: vm.searchData,
						contentType: "application/json",
				      success: (res) => {
						  	vm.totalCount = res.data.length;
							  vm.userList = res.data;
							  if(res.data.length){
								 for(var i=0; i<res.data.length; i++){
									 vm.userList[i].timeDiff = util.mToHi(res.data[i].timeDiff)
								 }
								}
								vm.checkDay()
							}
			        ,error: function (e) {
			        	$.alert(e.responseJSON.message);
			        }
				    });
    		},
    		checkDay:() => {
					if(vm.cDate !== vm.chkDate || vm.chkDay.substring(6, 8) >= 11){
						vm.selDisalbed = true
						$("#months6").attr('class', "bg-disabled")
					}else{
						vm.selDisalbed = false
						$("#months6").attr('class', "")
					}
				},
    		getMonths: () => {
					vm.months = []
					var j = 6
					for(var i=0; i<7; i++){
						var bDate = new Date(vm.searchData.sDate)
						var year = bDate.getFullYear();
			      var month = ("0" + (1 + bDate.getMonth())).slice(-2);
			      var day = "15";
						var aDate = new Date(year + "-" + month + "-" + day);
						var mDate = new Date(aDate.setMonth(aDate.getMonth() - j)).getMonth()+1
						j--
						if(mDate === 1){
							var cnYear = year.toString()
							mDate = cnYear.substring(2,4) + ".0" + mDate
						}
						vm.months.push(mDate + "월")
					}
				},
				getCmmnCodeList : () => {
					let param = {
						upperCmmnCode : 'USER_GRADE'
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
				fnGradeData : (userSeq, gradCode) => {
					var gradeData = {}
					if(vm.gradeList.length){
						for(var i=0; i<vm.gradeList.length; i++){
							if(vm.gradeList[i].userSeq === userSeq && gradCode !== "null"){
								vm.gradeList.splice(i)
								gradeData.gradYm = util.formmater.removeDash(vm.cDate)
								gradeData.userSeq = userSeq
								gradeData.gradCode = gradCode
								vm.gradeList.push(gradeData)
								return
							}else if(vm.gradeList[i].userSeq === userSeq && gradCode === "null"){
								vm.gradeList.splice(i)
								return
							}
						}
						gradeData.gradYm = util.formmater.removeDash(vm.cDate)
						gradeData.userSeq = userSeq
						gradeData.gradCode = gradCode
						vm.gradeList.push(gradeData)
					}else{
						gradeData.gradYm = util.formmater.removeDash(vm.cDate)
						gradeData.userSeq = userSeq
						gradeData.gradCode = gradCode
						vm.gradeList[vm.gradeList.length] = gradeData
					}
				},
				fnCancel :() => {
					$.confirm("변경사항을 취소 하시겠습니까?", () =>{
						vm.gradeData = []
						$.alert("취소되었습니다.", () =>{
							vm.fnSearch()
						})
					})
				},
				fnSave : () => {
					$.confirm("변경사항을 저장 하시겠습니까?", () =>{
						if(!vm.gradeList){
							$.alert("변경사항이 없습니다.")
							return
						}
						
						let param = {
							gradeList : vm.gradeList
						}
						$.sendAjax({
							url: "/userManage/upsertUserGrade.api",
							data: param,
							contentType: "application/json",
							success : (res) => {
								$.alert("변경사항이 저장되었습니다.")
							}			
						})
					})
				},
				
				cnGradeNm: (str) => {
					var str = str
					if(str === "USER_GRADE_01"){
						return "브론즈"
					}else if(str === "USER_GRADE_02"){
						return "실버"
					}else if(str === "USER_GRADE_03"){
						return "골드"
					}else if(str === "USER_GRADE_04"){
						return "플래티넘"
					}else if(str === "USER_GRADE_05"){
						return "다이아몬드"
					}else {
						return "-"
					}
				},
				
				exportExcel: () =>{
					
					excelList = JSON.parse(JSON.stringify(vm.userList))
					
					let param = {
						userList : excelList
					}
	        
	        for(i=0; i<param.userList.length; i++){
						param.userList[i].gradeHx = vm.cnGradeNm(param.userList[i].gradeHx)
						param.userList[i].gradePt = vm.cnGradeNm(param.userList[i].gradePt)
						param.userList[i].gradeQd = vm.cnGradeNm(param.userList[i].gradeQd)
						param.userList[i].gradeTp = vm.cnGradeNm(param.userList[i].gradeTp)
						param.userList[i].gradeDl = vm.cnGradeNm(param.userList[i].gradeDl)
						param.userList[i].gradeSg = vm.cnGradeNm(param.userList[i].gradeSg)
						param.userList[i].gradeZr = vm.cnGradeNm(param.userList[i].gradeZr)
						
					}
	        param.months = vm.months
	        let listDate = util.formmater.removeDash(vm.cDate)
	        listDate = listDate.substring(0,4) + "년" + listDate.substring(5,7) + "월"
	        param.listDate = listDate
	        $.sendAjax({
	            url: "/userManage/exportExcelUserGradeList.api",
	            data: param,
	            contentType: "application/json",
	            xhrFields: {
	                'responseType': 'blob'
	            },
	            success: (res, status, xhr) => {
	                let filename = '파일명.xlsx';
	                let filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
	                let disposition = xhr.getResponseHeader('Content-Disposition');
	                let matches = filenameRegex.exec(disposition);
	                if (matches != null && matches[1]) { 
	                  filename = matches[1].replace(/['"]/g, '');
	                }
	                
	                let link = document.createElement('a');
	                link.href = URL.createObjectURL(res);
	                link.download = decodeURI(filename);
	                link.click();
	            }
	        });
	    	}
		}
	})
	vm = app.mount("#content");
};

let event = {
	init : function() {
		$('#monthpicker').on('change', function () {
        vm.cDate = $('#monthpicker').val()
        vm.gradeData = []
        vm.fnSearch()
    })
	}
}

$(document).ready(() => {
	vueInit();
	vm.fnSearch();
  util.tableSetting();
  vm.getCmmnCodeList();
	var options = {
		minDate: new Date('2022-12-01'),
		yearSuffix: '년',
		dateFormat: 'yy-mm',
		monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
		monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
	};
	$('#monthpicker').monthpicker(options);
	event.init()
});

