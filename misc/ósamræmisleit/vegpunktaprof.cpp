#include <iostream>
#include <string>
#include <vector>
#include <algorithm>

using namespace std;

int main() {
  // Ath. ef fjöldi mælinga breytist er nauðsynlegt
  // að uppfæra eftirfarandi fasta
	int fjMaelinga = 18266;
  
	vector<string> maelingar(0);
	vector<string> punktar(0);
    string str;
	int i = 0;
  while (i++ < fjMaelinga) {
		cin >> str;
    maelingar.push_back(str);
  }
	while (cin >> str) {
    punktar.push_back(str);
  }
	sort(punktar.begin(), punktar.end());
	
	int msize = maelingar.size();
	int psize = punktar.size();
	cout << "Fjoldi maelinga: " << msize << "  Fjoldi skradra vegpunkta: " << psize << endl;
  cout << "Oskradir vegpunktar:" << endl;

	for(int j = 0; j < msize; j++) {
		bool b = binary_search(punktar.begin(), punktar.end(), maelingar[j]);
		if(!b) { cout << maelingar[j] << "\t"; }
	}
	cout << endl;
  return 0;
}