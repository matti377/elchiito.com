<?php

    $sname = "localhost";
    $unmae = "logger";
    $password = "iaMAevpi0204E.";

    $db_name = "elchiito";

    $conn = mysqli_connect($sname, $unmae, $password, $db_name);

    if(!$conn) {
        echo "Connection Failed";
    }