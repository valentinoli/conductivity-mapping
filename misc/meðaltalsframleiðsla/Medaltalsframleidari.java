import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Stack;
import java.util.Vector;

public class Medaltalsframleidari {
	public static void main(String[] args) throws FileNotFoundException, IOException {
		try (BufferedReader br = new BufferedReader(new FileReader(new File("repeated.txt")))) {
      // Skráin repeated.txt lesin inn
      // Hver lína hefur eftirfarandi dálka:
			// 0 Sendir  1 Vegp  2 Dags  3 Styrkur  4 Fjarl  5 Stefna
      // Forskilyrði:   línurnar í skránni repeated.txt eru raðaðar fyrst eftir 
      //                fyrsta dálki (sendi) og svo eftir öðrum dálki (vegpunkti).
      // Eftirskilyrði: Skráin newrecords.txt inniheldur meðaltöl endurtekinna 
      //                mælinga, sem koma hver á eftir annarri í skránni repeated.txt.
      //                Hvert meðaltal hefur þar að auki frávikshlutfall, sem skráð er í síðasta dálki.      
			
			Stack<String[]> linestack = new Stack<>(); // hlaði fyrir línurnar (mælingarnar) í skránni
			Vector<String> newlines = new Vector<>();  // vigur fyrir nýjar mælingar
			
			String line = br.readLine();
			linestack.push(line.split("\t"));
			Stack<Double> strengths = new Stack<>(); // hlaði fyrir styrktölur
        
        // Lesum allar línurnar úr skránni
		    while((line = br.readLine()) != null) {
		    	String[] next = line.split("\t");
		    	String[] prev = linestack.peek();
		    	
          // Ef næsta lína er frá nýjum mælistað eða sendi,
          // þá framkvæmum við aðgerðir á uppsafnaðar
          // endurteknar mælingar
		    	if(!(next[0]+next[1]).equals(prev[0]+prev[1])) {
		    		int latestDay = -1, latestMonth = -1, latestYear = -1;
		    		double strengthSum = 0.0, distSum = 0.0, dirSum = 0.0;
		    		double N = linestack.size(); // fjöldi endurtekinna mælinga
		    		String transm = prev[0], point = prev[1]; // sendir og staður
		    		
            // Framleiðum nýja mælingu sem er meðaltal
		    		while(!linestack.empty()) {
		    			String[] record = linestack.pop();
		    			
		    			double strength = Double.parseDouble(record[3]);
		    			strengths.push(strength);
		    			
		    			strengthSum += strength;
		    			distSum 	+= Double.parseDouble(record[4]);
		    			dirSum 		+= Double.parseDouble(record[5]);
              
              // Höldum utan um dagsetningu síðustu mælingar		    			
		    			// 0 Dagur  1 Mánuður  2 Ar
		    			String[] date = record[2].split("/");
		    			int year  = Integer.parseInt(date[2]);
		    			int month = Integer.parseInt(date[1]);
		    			int day   = Integer.parseInt(date[0]);
		    			if (
		    					(year > latestYear) || 
		    					(year == latestYear && month > latestMonth) ||
		    					(year == latestYear && month == latestMonth && day > latestDay)
		    			) {
		    				latestYear  = year;
		    				latestMonth = month;
		    				latestDay	= day;
		    			}
		    		}
		    		
		    		double avgStrength = strengthSum / N; // meðalstyrkur
		    		double avgDist = distSum / N;         // meðalfjarlægð (gat munað örlitlu í skráningu)
		    		double avgDir = dirSum / N;           // meðalstefna (gat munað örlitlu í skráningu)
		    		
            // Reiknum frávikshlutfallið, cvar
		    		double sqDevSum = 0.0;
		    		while(!strengths.empty()) {
		    			sqDevSum += Math.pow((strengths.pop() - avgStrength), 2);
		    		}
		    		double stdev = Math.sqrt(sqDevSum / (N-1));
		    		double cvar = stdev / avgStrength;
						// https://en.wikipedia.org/wiki/Coefficient_of_variation#Estimation
						cvar = cvar * (1 + (1 / (4 * N)));
		    		
		    		String y = "" + latestYear;
		    		String m = "" + latestMonth;
		    		String d = "" + latestDay;
		    		if(m.length() == 1) m = "0" + m;
		    		if(d.length() == 1) d = "0" + d;
		    		
		    		String newrecord = transm + "\t" + point + "\t" + d + "/" + m + "/" + y + "\t" 
		    		+ avgStrength + "\t" + avgDist + "\t" + avgDir + "\t" + cvar;
            // Bætum nýju mælingunni við
		    		newlines.add(newrecord);
		    	}
          
          // Setjum næstu línu á línuhlaðann
		    	linestack.push(next);
		    }
        
        // Búum til skrána newrecords.txt með gögnunum í newlines
		    Path file = Paths.get("newrecords.txt");
		    Files.write(file, newlines, Charset.forName("UTF-8"));  
		}
	}
}