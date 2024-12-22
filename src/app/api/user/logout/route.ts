import { NextRequest, NextResponse } from 'next/server';

/**
 * @param {NextRequest} req
 */
export async function DELETE(req: NextRequest) {
  try {
    // Buat respons kosong
    const response = NextResponse.json({ message: 'Cookie deleted successfully' });

    // Hapus cookie dengan mengatur expires ke waktu lampau
    response.cookies.set('refreshtoken', '', {
      path: '/api/user/refreshToken',
      httpOnly: true,
      expires: new Date(0), // Waktu kedaluwarsa ke epoch time
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
