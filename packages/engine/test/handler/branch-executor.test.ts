/* eslint-disable @typescript-eslint/no-explicit-any */
import { evaluateConditions } from '../../src/lib/handler/branch-executor'
import { BranchCondition, BranchOperator } from '@openops/shared'

describe('Branch evaluateConditions', () => {
    describe('DATE_IS_AFTER', () => {
        test.each([
            null,
            undefined,
            'not a date',
        ])('should return false when one of the values is not a date %p', (value) => {
            const condition: BranchCondition = {
                firstValue: value as string,
                secondValue: '2021-01-01',
                operator: BranchOperator.DATE_IS_AFTER,
            }

            expect(evaluateConditions([[condition]])).toEqual(false)
        })

        test('should return true when first date is after second date', () => {
            const condition: BranchCondition = {
                firstValue: '2021-01-02',
                secondValue: '2021-01-01',
                operator: BranchOperator.DATE_IS_AFTER,
            }

            expect(evaluateConditions([[condition]])).toEqual(true)
        })

        test.each([
            '2021-01-01',
            '2021-01-02',
        ])('should return false when first date is before or equal to second date', (firstDate) => {
            const condition: BranchCondition = {
                firstValue: firstDate,
                secondValue: '2021-01-02',
                operator: BranchOperator.DATE_IS_AFTER,
            }

            expect(evaluateConditions([[condition]])).toEqual(false)
        })

        test('should return false when the date is not in a supported format', () => {
            const condition: BranchCondition = {
                firstValue: '2021-01-02T00:00:00Z',
                secondValue: '1st January 2021',
                operator: BranchOperator.DATE_IS_AFTER,
            }

            expect(evaluateConditions([[condition]])).toEqual(false)
        })

        test('should compare time', () => {
            const condition: BranchCondition = {
                firstValue: '2021-01-01T00:00:02Z',
                secondValue: '2021-01-01T00:00:01Z',
                operator: BranchOperator.DATE_IS_AFTER,
            }

            expect(evaluateConditions([[condition]])).toEqual(true)
        })
    })

    describe('DATE_IS_BEFORE', () => {
        test.each([
            null,
            undefined,
            'not a date',
        ])('should return false when one of the values is not a date %p', (value) => {
            const condition: BranchCondition = {
                firstValue: value as string,
                secondValue: '2021-01-01',
                operator: BranchOperator.DATE_IS_BEFORE,
            }

            expect(evaluateConditions([[condition]])).toEqual(false)
        })

        test('should return true when first date is before second date', () => {
            const condition: BranchCondition = {
                firstValue: '2021-01-01',
                secondValue: '2021-01-02',
                operator: BranchOperator.DATE_IS_BEFORE,
            }

            expect(evaluateConditions([[condition]])).toEqual(true)
        })

        test.each([
            '2021-01-01',
            '2021-01-02',
        ])('should return false when first date is after or equal to second date', (firstDate) => {
            const condition: BranchCondition = {
                firstValue: firstDate,
                secondValue: '2021-01-01',
                operator: BranchOperator.DATE_IS_BEFORE,
            }

            expect(evaluateConditions([[condition]])).toEqual(false)
        })

        test('should return false when the date is not in a supported format', () => {
            const condition: BranchCondition = {
                firstValue: '2021-01-02T00:00:00Z',
                secondValue: '2nd January 2021',
                operator: BranchOperator.DATE_IS_BEFORE,
            }

            expect(evaluateConditions([[condition]])).toEqual(false)
        })

        test('should compare time', () => {
            const condition: BranchCondition = {
                firstValue: '2021-01-01T00:00:01Z',
                secondValue: '2021-01-01T00:00:02Z',
                operator: BranchOperator.DATE_IS_BEFORE,
            }

            expect(evaluateConditions([[condition]])).toEqual(true)
        })
    })

    describe('LIST_IS_EMPTY', () => {
        test.each([
            [],
            '[]',
        ])('should return true when list is empty %p', (input: any) => {
            const condition: BranchCondition = {
                firstValue: input,
                operator: BranchOperator.LIST_IS_EMPTY,
            }

            expect(evaluateConditions([[condition]])).toEqual(true)
        })

        test.each([
            [1],
            '[1]',
        ])('should return false when list is not empty %p', (input: any) => {
            const condition: BranchCondition = {
                firstValue: input,
                operator: BranchOperator.LIST_IS_EMPTY,
            }

            expect(evaluateConditions([[condition]])).toEqual(false)
        })

        test.each([
            null,
            undefined,
            'not a list',
            {},
        ])('should return false when the value is not a list %p', (input: any) => {
            const condition: BranchCondition = {
                firstValue: input,
                operator: BranchOperator.LIST_IS_EMPTY,
            }

            expect(evaluateConditions([[condition]])).toEqual(false)
        })
    })

    describe('LIST_IS_NOT_EMPTY', () => {
        test.each([
            [1],
            '[1]',
        ])('should return true when list is not empty %p', (input: any) => {
            const condition: BranchCondition = {
                firstValue: input,
                operator: BranchOperator.LIST_IS_NOT_EMPTY,
            }

            expect(evaluateConditions([[condition]])).toEqual(true)
        })

        test.each([
            [],
            '[]',
        ])('should return false when list is empty %p', (input: any) => {
            const condition: BranchCondition = {
                firstValue: input,
                operator: BranchOperator.LIST_IS_NOT_EMPTY,
            }

            expect(evaluateConditions([[condition]])).toEqual(false)
        })

        test.each([
            null,
            undefined,
            'not a list',
            {},
        ])('should return false when the value is not a list %p', (input: any) => {
            const condition: BranchCondition = {
                firstValue: input,
                operator: BranchOperator.LIST_IS_NOT_EMPTY,
            }

            expect(evaluateConditions([[condition]])).toEqual(false)
        })
    })

    describe('LIST_COUNT_IS_GREATER_THAN', () => {
        test.each([
            [1, 2, 3],
            '[1,2,3]',
        ])('should return true when list count is greater than given value %p', (input: any) => {
            const condition: BranchCondition = {
                firstValue: input,
                secondValue: '2',
                operator: BranchOperator.LIST_COUNT_IS_GREATER_THAN,
            }

            expect(evaluateConditions([[condition]])).toEqual(true)
        })

        test.each([
            [1],
            '[1]',
        ])('should return false when list count is less than given value %p', (input: any) => {
            const condition: BranchCondition = {
                firstValue: input,
                secondValue: '2',
                operator: BranchOperator.LIST_COUNT_IS_GREATER_THAN,
            }

            expect(evaluateConditions([[condition]])).toEqual(false)
        })

        test.each([
            [1, 2],
            '[1,2]',
        ])('should return false when list count is equal to the given value %p', (input: any) => {
            const condition: BranchCondition = {
                firstValue: input,
                secondValue: '2',
                operator: BranchOperator.LIST_COUNT_IS_GREATER_THAN,
            }

            expect(evaluateConditions([[condition]])).toEqual(false)
        })

        test.each([
            null,
            undefined,
            'not a list',
            {},
        ])('should return false when the value is not a list %p', (input: any) => {
            const condition: BranchCondition = {
                firstValue: input,
                secondValue: '2',
                operator: BranchOperator.LIST_COUNT_IS_GREATER_THAN,
            }

            expect(evaluateConditions([[condition]])).toEqual(false)
        })
    })

    describe('LIST_COUNT_IS_LESS_THAN', () => {
        test.each([
            [1, 2, 3],
            '[1,2,3]',
        ])('should return false when list count is greater than given value %p', (input: any) => {
            const condition: BranchCondition = {
                firstValue: input,
                secondValue: '2',
                operator: BranchOperator.LIST_COUNT_IS_LESS_THAN,
            }

            expect(evaluateConditions([[condition]])).toEqual(false)
        })

        test.each([
            [1],
            '[1]',
        ])('should return true when list count is less than given value %p', (input: any) => {
            const condition: BranchCondition = {
                firstValue: input,
                secondValue: '2',
                operator: BranchOperator.LIST_COUNT_IS_LESS_THAN,
            }

            expect(evaluateConditions([[condition]])).toEqual(true)
        })

        test.each([
            [1, 2],
            '[1,2]',
        ])('should return false when list count is equal to the given value %p', (input: any) => {
            const condition: BranchCondition = {
                firstValue: input,
                secondValue: '2',
                operator: BranchOperator.LIST_COUNT_IS_LESS_THAN,
            }

            expect(evaluateConditions([[condition]])).toEqual(false)
        })

        test.each([
            null,
            undefined,
            'not a list',
            {},
        ])('should return false when the value is not a list %p', (input: any) => {
            const condition: BranchCondition = {
                firstValue: input,
                secondValue: '2',
                operator: BranchOperator.LIST_COUNT_IS_LESS_THAN,
            }

            expect(evaluateConditions([[condition]])).toEqual(false)
        })
    })

    describe('LIST_COUNT_IS_EQUAL_TO', () => {
        test.each([
            [1, 2, 3],
            '[1,2,3]',
        ])('should return false when list count is greater than given value %p', (input: any) => {
            const condition: BranchCondition = {
                firstValue: input,
                secondValue: '2',
                operator: BranchOperator.LIST_COUNT_IS_EQUAL_TO,
            }

            expect(evaluateConditions([[condition]])).toEqual(false)
        })

        test.each([
            [1],
            '[1]',
        ])('should return false when list count is less than given value %p', (input: any) => {
            const condition: BranchCondition = {
                firstValue: input,
                secondValue: '2',
                operator: BranchOperator.LIST_COUNT_IS_EQUAL_TO,
            }

            expect(evaluateConditions([[condition]])).toEqual(false)
        })

        test.each([
            [1, 2],
            '[1,2]',
        ])('should return true when list count is equal to the given value %p', (input: any) => {
            const condition: BranchCondition = {
                firstValue: input,
                secondValue: '2',
                operator: BranchOperator.LIST_COUNT_IS_EQUAL_TO,
            }

            expect(evaluateConditions([[condition]])).toEqual(true)
        })

        test.each([
            null,
            undefined,
            'not a list',
            {},
        ])('should return false when the value is not a list %p', (input: any) => {
            const condition: BranchCondition = {
                firstValue: input,
                secondValue: '2',
                operator: BranchOperator.LIST_COUNT_IS_EQUAL_TO,
            }

            expect(evaluateConditions([[condition]])).toEqual(false)
        })
    })

    const listContainsElementUnderEvaluation : [any, any][] = [
        ['["test","test1"]', 'test'],
        ['["test",1,true]', '1'],
        ['["test",2,false]', 'false'],
        ['[{"class":"xpto","lines":1000},{"class":"xpto1","lines":2000}]', '{"class":"xpto1","lines":2000}'],
        ['[{"class":"xpto","lines":1000},{"class":"xpto1","lines":2000}]', '{"lines":2000,"class":"xpto1"}'],
        ['[{"class":"xpto","lines":1000},{"class":"xpto1","lines":2000}]', {"class":"xpto1","lines":2000}],
        ['[{"class":"xpto","lines":1000},{"class":"xpto1","lines":2000}]', {"lines":2000,"class":"xpto1"}],
        ['[["1"],["2"]]', '["1"]'],
        ['[["1"],["2"]]', ["1"]],
        ['[[1],[2]]', [1]],
    ];

    const listNotContainsElementUnderEvaluation: [any, any][]  = [
        ['["test"]', 'test2'],
        ['[{"class":"xpto","lines":1000},{"class":"xpto1","lines":2000}]', '{"class":"xpto1","lines":2002}'],
        ['[{"class":"xpto","lines":1000},{"class":"xpto1","lines":2000}]', {"class":"xpto1"}],
        ['[{"class":"xpto","lines":1000},{"class":"xpto1","lines":2000}]', '{"class":"xpto1"}'],
        ['[{"class":"xpto","lines":1000},{"class":"xpto1","lines":2000}]', undefined],
        ['[{"class":"xpto","lines":1000},{"class":"xpto1","lines":2000}]', null],
        ['[]', {"class":"xpto1"}],
        ['[]', {}],
        ['[]', '{}'],
        ['[["1"],["2"]]', '["3"]'],
        ['[{"class":"xpto","lines":1000},{"class":"xpto1","lines":2000}]', 'xpto'],
        [ null, 'xpto',],
        [ undefined, 'xpto'],
    ];

    describe('Operation LIST_CONTAINS', () => {
        test.each(listContainsElementUnderEvaluation)('should verify that the list (%s) contains the element under evaluation (%s)', (listForEvaluation: any, elementToEvaluate: any) => {
            const condition: BranchCondition = {
                firstValue: listForEvaluation,
                secondValue: elementToEvaluate,
                operator: BranchOperator.LIST_CONTAINS,
            }
            expect(evaluateConditions([[condition]])).toEqual(true)
        });

        test.each(
            listNotContainsElementUnderEvaluation 
        )('should verify that the list (%s) does not contains the element under evaluation (%s)', (listForEvaluation: any, elementToEvaluate: any) => {

            const condition: BranchCondition = {
                firstValue: listForEvaluation,
                secondValue: elementToEvaluate,
                operator: BranchOperator.LIST_CONTAINS,
            }

            expect(evaluateConditions([[condition]])).toEqual(false)
        });
    })

    describe('Operation LIST_NOT_CONTAINS', () => {
        test.each(listNotContainsElementUnderEvaluation)('should verify that the list (%s) does not contains the element under evaluation (%s)', (listForEvaluation: any, elementToEvaluate: any) => {

            const condition: BranchCondition = {
                firstValue: listForEvaluation,
                secondValue: elementToEvaluate,
                operator: BranchOperator.LIST_NOT_CONTAINS,
            }

            expect(evaluateConditions([[condition]])).toEqual(true)
        });

        test.each(listContainsElementUnderEvaluation)('should verify that the list (%s) contains the element under evaluation (%s)', (listForEvaluation: any, elementToEvaluate: any) => {

            const condition: BranchCondition = {
                firstValue: listForEvaluation,
                secondValue: elementToEvaluate,
                operator: BranchOperator.LIST_NOT_CONTAINS,
            }

            expect(evaluateConditions([[condition]])).toEqual(false)
        });
    });
})
