/* @exclude */
/*
@license https://github.com/t2ym/thin-hook/blob/master/LICENSE.md
Copyright (c) 2017, 2018, 2019, 2020 Tetsuya Mori <t2y3141592@gmail.com>. All rights reserved.
*/
/* @endexclude */
/* @ifndef S_PARAM */
const S_PARAM = Symbol('parameter'); // extensible parameters for policies to be defined in thin-hook/plugins/Symbols.js
/* @endif */
const basePolicyModule /* @echo EQUAL *//* @echo SPACE *//* @extend basePolicyModule.js *//* @endextend */;
const libPolicyModule /* @echo EQUAL *//* @echo SPACE *//* @extend libPolicyModule.js *//* @endextend */;
const appPolicyModule /* @echo EQUAL *//* @echo SPACE *//* @extend appPolicyModule.js *//* @endextend */;
Policy.mergePolicyModules(
  { contextNormalizer, acl },
  basePolicyModule,
  libPolicyModule,
  appPolicyModule,
);