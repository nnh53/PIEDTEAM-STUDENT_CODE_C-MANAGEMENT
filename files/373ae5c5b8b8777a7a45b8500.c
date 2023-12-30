#include <stdio.h>
#include <stdlib.h>

/*
Viết chương trình nhận vào 1 số nguyên,
 tính tổng,tích các thành phần và
  in ra số đó dưới dạng đảo ngược ( 4p )
*/

int main()
{
    int n;
    printf("\nNhap n di cu: ");
    scanf("%d", &n);
    // 2 chữ số trở lên
    int sum = 0;
    int mul = 1;
    int tmp = n;
    int rev = 0;
    //đổi numb -> rev
    while(tmp > 0){
        //123
        int a = tmp % 10;
        tmp = tmp / 10;
        sum += a;
        mul *= a;
        rev = rev * 10 + a;
    }
    printf("\n%d - %d - %d", rev, sum, mul);
    return 0;
}
