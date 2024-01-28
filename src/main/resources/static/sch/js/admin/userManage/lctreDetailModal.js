let lctreOneDetail = {}
let lctreFxList = []
function detailModal(lctreSeq){
	
	$.get("/sch/admin/userManage/lctreDetailModal.html", function (data) {
    $("#modalBody").html(data);
  })
  let param = {
		lctreSeq : lctreSeq
	}
  $.sendAjax({
		url: "/userManage/selectLctreOneDetail.api",
		data : param,
		contentType: "application/json",
		success : (res) => {
			lctreOneDetail = res.data.lctreOneDetail
			lctreFxList = res.data.lctreFxList
			modalBind(lctreOneDetail, lctreFxList);
		}
	})
}

function modalBind(lctreOneDetail, lctreFxList){
	$("#lctreNm").text(lctreOneDetail.lctreNm)
	$("#lctreDe").text(util.addDateDot(lctreOneDetail.lctreBeginDe) + " ~ " + util.addDateDot(lctreOneDetail.lctreEndDe))
	$("#lctreWeekArr").text(util.numToDay(lctreOneDetail.lctreWeekArray))
	$("#lctreTm").text(util.cnTime(lctreOneDetail.lctreBeginTime) + " ~ " + util.cnTime(lctreOneDetail.lctreEndTime))
	$("#img").attr('src', lctreOneDetail.lctreImageCn)
	$("#prfImg").attr('src', lctreOneDetail.proflImageCn)
	$("#profsrUserNm").text(lctreOneDetail.profsrUserNm + " 교수님")
	//<br> => enter
	var profsrHist = lctreOneDetail.profsrHist;
	if(util.emptyCheck(profsrHist) !== ''){
		profsrHist = profsrHist.split('<br>').join("\n");
	}else{
		profsrHist = '등록된 이력이 없습니다.'
	}
	$("#profsrHist").text(profsrHist)
	$("#lctrePlaceNm").text(lctreOneDetail.lctrePlaceNm)
	$("#lctreDc").text(lctreOneDetail.lctreDc)
	if(lctreFxList.length){
		for(var i=0; i<lctreFxList.length; i++){
			$("#lctreFxList").append(
				$("<div/>").text(lctreFxList[i].lctreSj)
								.attr('onclick', 'toastShow('+i+')')
								.attr('class', 'modal-text-box mb-1')
								.attr('id', 'toast' + i)
			)
			
			$("#toastList").append(
				$("<div/>").attr('id', 'toastr' + i)
									.attr('class', 'toastr hide')
									.text("-")
			)
		}
	}else{
		$("#lctreFxList").append(
			$("<div/>").attr('class', 'mt-3 col').text("등록된 강의 목록이 없습니다.")
		)
	}
}

function toastShow(i){
	for(var j=0; j<lctreFxList.length; j++){
		var height = $("#toast"+j).css('height');
		$("#toastr"+j).attr('style', 'height:'+height)
	}
	$("#toastList").find('.show').attr('class', 'toastr hide').attr('style','').text("-")
	$("#toastr"+i).attr('class', 'toastr modal-toast-box show').attr('style', '').text(lctreFxList[i].lctreDtls)
	setTimeout(function() {
      $("#toastr"+i).fadeIn(500, function() {
          msgTimer = setTimeout(function() {
			  			var height = $("#toast"+i).css("height");
              $("#toastr"+i).fadeOut(500).attr('class', 'toastr hide').attr('style', 'height:'+height).text("");
          }, 3000);
      });
  },);
}

