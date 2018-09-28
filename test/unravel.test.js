import unravel from '../src/unravel';

test('test validation', () => {
    expect(function() {
        unravel();
    }).toThrow();

    expect(function() {
        unravel(undefined);
    }).toThrow();

    expect(function() {
        unravel(5);
    }).toThrow();

    expect(function() {
        unravel({});
    }).toThrow();

    expect(function() {
        unravel([]);
    }).toThrow();

    expect(function() {
        unravel(function() {});
    }).not.toThrow();

    expect(function() {
        unravel(() => {});
    }).not.toThrow();

    expect(function() {
        unravel(() => {}, undefined);
    }).not.toThrow();

    expect(function() {
        unravel(() => {}, {});
    }).toThrow();

    expect(function() {
        unravel(() => {}, 5);
    }).toThrow();

    expect(function() {
        unravel(() => {}, []);
    }).not.toThrow();

    expect(function() {
        unravel(() => {}, ['a']);
    }).not.toThrow();
});

test('test basic functionality', () => {
    let fooWith = unravel(foo);

    expect(fooWith.a(1).b(2).c(3)).toBe(2);
    expect(fooWith.a(5).b(4).c(3)).toBe(4);
    expect(fooWith.a(3).b(3).c(3)).toBe(3);
});

test('test function with no parameters', () => {
    function a() {
        return 5;
    }

    let aWith = unravel(a);

    expect(typeof aWith).toBe('function');
    expect(aWith()).toBe(5);
});

test('ensure order of args does not matter', () => {
    let fooWith = unravel(foo);

    expect(fooWith.a(10).b(5).c(2)).toBe(7);
    expect(fooWith.a(10).c(2).b(5)).toBe(7);
    expect(fooWith.b(5).a(10).c(2)).toBe(7);
    expect(fooWith.b(5).c(2).a(10)).toBe(7);
    expect(fooWith.c(2).b(5).a(10)).toBe(7);
    expect(fooWith.c(2).a(10).b(5)).toBe(7);
});

test('test structure of chain object', () => {
    testChainObjectStructure(unravel(foo), [3, 2, 1], ['a', 'b', 'c'], 'number', 2);
    testChainObjectStructure(unravel(foo), [3, 1, 2], ['a', 'c', 'b'], 'number', 2);
    testChainObjectStructure(unravel(foo), [2, 3, 1], ['b', 'a', 'c'], 'number', 2);
    testChainObjectStructure(unravel(foo), [2, 1, 3], ['b', 'c', 'a'], 'number', 2);
    testChainObjectStructure(unravel(foo), [1, 3, 2], ['c', 'a', 'b'], 'number', 2);
    testChainObjectStructure(unravel(foo), [1, 2, 3], ['c', 'b', 'a'], 'number', 2);
});

test('test structure of chain object with overridden parameters', () => {
    testChainObjectStructure(unravel(foo, []), [3, 2, 1], ['a', 'b', 'c'], 'number', 2);
    testChainObjectStructure(unravel(foo, ['d']), [3, 2, 1], ['d', 'b', 'c'], 'number', 2);
    testChainObjectStructure(unravel(foo, ['d', 'e']), [3, 2, 1], ['d', 'e', 'c'], 'number', 2);
    testChainObjectStructure(unravel(foo, ['d', 'e', 'f']), [3, 2, 1], ['d', 'e', 'f'], 'number', 2);
    testChainObjectStructure(unravel(foo, ['d', null]), [3, 2, 1], ['d', 'b', 'c'], 'number', 2);
    testChainObjectStructure(unravel(foo, ['d', null, null]), [3, 2, 1], ['d', 'b', 'c'], 'number', 2);
    testChainObjectStructure(unravel(foo, [null, 'e']), [3, 2, 1], ['a', 'e', 'c'], 'number', 2);
    testChainObjectStructure(unravel(foo, [null, 'e', null]), [3, 2, 1], ['a', 'e', 'c'], 'number', 2);
    testChainObjectStructure(unravel(foo, [null, null, 'f']), [3, 2, 1], ['a', 'b', 'f'], 'number', 2);
    testChainObjectStructure(unravel(foo, [null, 'f']), [3, 2, 1], ['a', 'f', 'c'], 'number', 2);
    testChainObjectStructure(unravel(foo, [null, null, null]), [3, 2, 1], ['a', 'b', 'c'], 'number', 2);
    testChainObjectStructure(unravel(foo, [null, null]), [3, 2, 1], ['a', 'b', 'c'], 'number', 2);
    testChainObjectStructure(unravel(foo, [null]), [3, 2, 1], ['a', 'b', 'c'], 'number', 2);
});

test('test short-circuit evaluation', () => {
    let fooWith = unravel(foo);

    expect(fooWith.eval()).toBe(7);
    expect(fooWith.a(18).eval()).toBe(15);
    expect(fooWith.a(18).b(1).eval()).toBe(22);
});

test('test overriding parameter names', () => {
    expect(unravel(foo, []).a(3).b(2).c(1)).toBe(2);
    expect(unravel(foo, ['d']).d(3).b(2).c(1)).toBe(2);
    expect(unravel(foo, ['d', 'e']).d(3).e(2).c(1)).toBe(2);
    expect(unravel(foo, ['d', 'e', 'f']).d(3).e(2).f(1)).toBe(2);
    expect(unravel(foo, ['d', null]).d(3).b(2).c(1)).toBe(2);
    expect(unravel(foo, ['d', null, null]).d(3).b(2).c(1)).toBe(2);
    expect(unravel(foo, [null, 'e']).a(3).e(2).c(1)).toBe(2);
    expect(unravel(foo, [null, 'e', null]).a(3).e(2).c(1)).toBe(2);
    expect(unravel(foo, [null, null, 'f']).a(3).b(2).f(1)).toBe(2);
    expect(unravel(foo, [null, 'f']).a(3).f(2).c(1)).toBe(2);
    expect(unravel(foo, [null, null, null]).a(3).b(2).c(1)).toBe(2);
    expect(unravel(foo, [null, null]).a(3).b(2).c(1)).toBe(2);
    expect(unravel(foo, [null]).a(3).b(2).c(1)).toBe(2);
});

test('test function with optional parameters using arguments object', () => {
    let barWith = unravel(bar);
    expect(barWith.eval()).toBe(7);
    expect(barWith.a(15).eval()).toBe(12);
    expect(barWith.a(15).b(1)).toBe(19);

    barWith = unravel(bar, []);
    expect(barWith.eval()).toBe(7);
    expect(barWith.a(15).eval()).toBe(12);
    expect(barWith.a(15).b(1)).toBe(19);

    barWith = unravel(bar, ['a']);
    expect(barWith.eval()).toBe(7);
    expect(barWith.a(15).eval()).toBe(12);
    expect(barWith.a(15).b(1)).toBe(19);

    barWith = unravel(bar, ['a', 'b']);
    expect(barWith.eval()).toBe(7);
    expect(barWith.a(15).eval()).toBe(12);
    expect(barWith.a(15).b(1)).toBe(19);

    barWith = unravel(bar, ['a', 'b', 'c']);
    expect(barWith.eval()).toBe(7);
    expect(barWith.a(15).eval()).toBe(12);
    expect(barWith.a(15).b(1).eval()).toBe(19);
    expect(barWith.a(15).b(1).c(2)).toBe(16);
});

function foo(a, b, c) {
    a = a || 10;
    b = b || 8;
    c = c || 5;
    return a - b + c;
}

function bar(a, b) {
    a = a || 10;
    b = b || 8;
    let c = arguments[2] || 5;
    return a - b + c;
}

function testChainObjectStructure(chainObject, args, params, resultType, result) {
    params.forEach(function(param, paramIndex) {
        chainObject = chainObject[param](args[paramIndex]);

        if(paramIndex < params.length - 1) {
            expect(Object.keys(chainObject).length).toBe(params.length - paramIndex);
            expect(typeof chainObject.eval).toBe('function');

            for(let i = paramIndex; i < param.size; i++) {
                expect(typeof chainObject[params[i]]).toBe('function');
            }
        }
    });

    expect(typeof chainObject).toBe(resultType);
    expect(chainObject).toBe(result);
}
