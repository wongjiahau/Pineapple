import { testError } from "../../tests/testUtil";

testError("ErrorImportFail",
`
import "hello.pine"
`
);