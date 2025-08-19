<?php

namespace App\Enums;

enum DeveloperSkill: string
{
    case Frontend = 'frontend';
    case Backend = 'backend';
    case Network = 'network';
    case Database = 'database';
    case Security = 'security';
}
