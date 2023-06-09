<%@ page language="java" contentType="text/html; charset=EUC-KR"
    pageEncoding="EUC-KR"%> 
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=EUC-KR">
<title>ExampleParamter6</title>
</head>
<body> 
<script src="https://code.jquery.com/jquery-1.11.3.js"></script>
<script>
$(function(){
	var json = {
			user : {
				name:'민예린',
				age:30,
				address:'관악구'
			}
	};
	console.log(json);
	$.ajax({
		url : '/example/parameter/examaple6/saveData',
		type: 'post',
		data : JSON.stringify(json),
		contentType: 'application/json',
		dataType: 'json',
		success : function(data){
			console.log(data);
		}
	});
});
</script>
</body>
</html>