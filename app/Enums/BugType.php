<?php

namespace App\Enums;

enum BugType: string
{
    case Tampilan = 'Tampilan';
    case Performa = 'Performa';
    case Fitur = 'Fitur';
    case Keamanan = 'Keamanan';
    case Error = 'Error';
    case Lainnya = 'Lainnya';
}
