<?php
const ENCRYPTION_KEY = 'qkwlerqkwlerqkwlerqkwlerqkwlerqkwl';
function encrypt($data): string
{
    $iv = openssl_random_pseudo_bytes(openssl_cipher_iv_length('aes-256-cbc'));
    $encrypted = openssl_encrypt($data, 'aes-256-cbc', ENCRYPTION_KEY, 0, $iv);
    return base64_encode($encrypted . '::' . base64_encode($iv));
}

function decrypt($data): string
{
    list($encrypted_data, $iv) = explode('::', base64_decode($data), 2);
    return openssl_decrypt($encrypted_data, 'aes-256-cbc', ENCRYPTION_KEY, 0, base64_decode($iv));
}

?>
