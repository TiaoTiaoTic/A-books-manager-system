<?php
$db_username="books_ma_users";
$db_password="120938";
$admin_username='books_ma_admin';
$admin_password="102938";
if($_POST)
{
    if($_POST['action']=='delete_board')
    {
        $id=$_POST['id'];
        $query="DELETE FROM boards WHERE id=$id";
        $result=db_connect_admin($query);
        if(!$result){echo '0';}
        else{echo '1';}
    }
    if($_POST['action']=='change_board')
    {
        $id=$_POST['id'];
        $title=$_POST['title'];
        $content=$_POST['content'];
        $query="UPDATE boards SET title='$title',content='$content',adj_date=current_date() WHERE id=$id";
        $result=db_connect_admin($query);
        if(!$result){echo '0';}
        else{echo '1';}
    }
    if($_POST['action']=='release')
    {
        $title=$_POST['title'];
        $board=$_POST['board'];
        $query="INSERT INTO boards (send_date,adj_date,title,content) VALUES (current_date(),current_date(),'$title','$board');";
        $result=db_connect_admin($query);
        if(!$result){echo '0';}
        else{echo '1';}
    }
}
if($_GET)
{	
    if($_GET['action']=='getboardbyid'){
        $bid=$_GET['id'];
        $query="SELECT id,send_date,adj_date,title,content FROM boards WHERE id=$bid;";
        $result=db_connect($query);
        if(!$result){echo json_encode('fail');}
        else{
            $boards=array();
            while($row=$result->fetch_assoc())
            {
                array_push($boards,array('id'=>$row['id'],'send_date'=>$row['send_date'],'adj_date'=>$row['adj_date'],'title'=>$row['title'],'content'=>$row['content']));
            }
            echo json_encode($boards);
        }
    }
    if($_GET['action']=='getboardsbydate'){
        $date=$_GET['date'];
        $query="SELECT id,send_date,adj_date,title,content FROM boards WHERE send_date='$date' ORDER BY send_date DESC";
        $result=db_connect($query);
        if(!$result){echo json_encode('fail');}
        else{
            $boards=array();
            while($row=$result->fetch_assoc())
            {
                array_push($boards,array('id'=>$row['id'],'send_date'=>$row['send_date'],'adj_date'=>$row['adj_date'],'title'=>$row['title'],'content'=>$row['content']));
            }
            echo json_encode($boards);
        }
    }
    if($_GET['action']=='getallboards')
    {
        $query="SELECT id,send_date,adj_date,title,content FROM boards ORDER BY send_date DESC";
        $result=db_connect($query);
        if(!$result){echo json_encode('fail');}
        else{
            $boards=array();
            while($row=$result->fetch_assoc())
            {
                array_push($boards,array('id'=>$row['id'],'send_date'=>$row['send_date'],'adj_date'=>$row['adj_date'],'title'=>$row['title'],'content'=>$row['content']));
            }
            echo json_encode($boards);
        }
    }
    if($_GET['action']=='getcontent')
    {
        $query="SELECT id,send_date,adj_date,title,content FROM boards WHERE id=";    $query.=$_GET['id'];
        $result=db_connect($query);
        if ($result->num_rows > 0) 
        {	$board=array();
            while($row = $result->fetch_assoc()) 
            {	array_push($board,array('id'=>$row['id'],'send_date'=>$row['send_date'],'adj_date'=>$row['adj_date'],'title'=>$row['title'],'content'=>$row['content']));
            }
            echo json_encode(array("board" => $board));
        }
        else
        {	echo "0 结果";
        }
    }
    if($_GET['action']=='getBoards')
    {	$query="SELECT id,adj_date,title FROM boards ORDER BY adj_date DESC";
        $result=db_connect($query);
        if ($result->num_rows > 0) 
        {	$boards=array();
            while($row = $result->fetch_assoc()) 
            {	array_push($boards,array('id'=>$row['id'],'adj_date'=>$row['adj_date'],'title'=>$row['title']));
            }
            echo json_encode(array("boards" => $boards));
        }
        else
        {	echo "0 结果";
        }
    }
}
function db_connect($query)
{	global $db_username,$db_password;
	$con=mysqli_connect('127.0.0.1',$db_username,$db_password,'books_ma');
	if ($con->connect_error) 
	{	echo "连接 MySQL 失败: " . mysqli_connect_error();
	} 
	else
	{
	}
	$result=mysqli_query($con,$query);
	mysqli_close($con);
	return $result;
}
function db_connect_admin($query)
{	global $admin_username,$admin_password;
	$con=mysqli_connect('127.0.0.1',$admin_username,$admin_password,'books_ma');
	if ($con->connect_error) 
	{	echo "连接 MySQL 失败: " . mysqli_connect_error();
	} 
	else
	{
	}
	$result=mysqli_query($con,$query);
	mysqli_close($con);
	return $result;
}
?>