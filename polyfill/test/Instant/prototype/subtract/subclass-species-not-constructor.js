// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.instant.prototype.subtract
---*/

function check(value, description) {
  const instant = Temporal.Instant.fromEpochNanoseconds(10n);
  instant.constructor = {
    [Symbol.species]: value,
  };
  assert.throws(TypeError, () => instant.subtract({ nanoseconds: 1 }), description);
}

check(true, "true");
check("test", "string");
check(Symbol(), "Symbol");
check(7, "number");
check(7n, "bigint");
check({}, "plain object");
