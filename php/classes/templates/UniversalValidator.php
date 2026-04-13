<?php

namespace templates;

use DateTime;

class UniversalValidator
{
 public static function validate(mixed $value, string $type, mixed $pattern, bool $isError = false): array|bool {
     if(empty($value)){
         return $isError ? ['isValid' => true, 'error' => null] : true;
     }
     switch ($type){
         case 'regex':
             if(!preg_match($pattern, $value)){
                 return $isError ? ['isValid' => false, 'error' => 'Wartość jest nieprawidłowa'] : false;
             }
             break;
         case 'email':
             if(!filter_var($value, $pattern)){
                 return $isError ? ['isValid' => false, 'error' => 'Nieprawidłowy format adresu'] : false;
             }
             break;
         case 'password_verify':
             if(!password_verify($value, $pattern)){
                 return $isError ? ['isValid' => false, 'error' => 'Hasło jest nieprawidłowe'] : false;
             }
             break;
         case 'match':
             if($value !== $pattern){
                 return $isError ? ['isValid' => false, 'error' => 'Hasła się różnią'] : false;
             }
             break;
         case 'length':
             if (strlen($value) !== $pattern){
                 return $isError ? ['isValid' => false, 'error' => 'Wartość jest nieprawidłowa'] : false;
             }
             break;
         case 'datetime':
             $date = DateTime::createFromFormat($pattern, $value);
             if(!$date || $date->format($pattern) !== $value){
                 return $isError ? ['isValid' => false, 'error' => 'Nieprawidłowy format daty'] : false;
             }
             break;
         default : return $isError ? ['isValid' => false, 'error' => 'Nieznany format'] : false;
     }
     return $isError ? ['isValid' => true, 'error' => null] : true;
 }
}